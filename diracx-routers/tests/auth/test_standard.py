import base64
import hashlib
import secrets
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import httpx
import jwt
import pytest
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from pytest_httpx import HTTPXMock

from diracx.core.config import Config
from diracx.core.properties import NORMAL_USER, PROXY_MANAGEMENT, SecurityProperty
from diracx.routers.auth import (
    AuthSettings,
    _server_metadata_cache,
    create_token,
    get_server_metadata,
    parse_and_validate_scope,
)

DIRAC_CLIENT_ID = "myDIRACClientID"


@pytest.fixture
def non_mocked_hosts(test_client) -> list[str]:
    return [test_client.base_url.host]


@pytest.fixture
async def auth_httpx_mock(httpx_mock: HTTPXMock, monkeypatch):
    data_dir = Path(__file__).parent.parent / "data"
    path = "lhcb-auth.web.cern.ch/.well-known/openid-configuration"
    httpx_mock.add_response(url=f"https://{path}", text=(data_dir / path).read_text())

    server_metadata = await get_server_metadata(f"https://{path}")

    id_tokens = ["user1", "user2"]

    def custom_response(request: httpx.Request):
        if b"&code=valid-code&" in request.content:
            id_token = id_tokens.pop(0)
            return httpx.Response(status_code=200, json={"id_token": id_token})
        return httpx.Response(status_code=401)

    httpx_mock.add_callback(custom_response, url=server_metadata["token_endpoint"])

    monkeypatch.setattr("diracx.routers.auth.parse_id_token", fake_parse_id_token)

    yield httpx_mock

    _server_metadata_cache.clear()


async def fake_parse_id_token(raw_id_token: str, audience: str, *args, **kwargs):
    """Return a fake ID token as if it were returned by an external IdP"""
    id_tokens = {
        "user1": {
            "aud": "5c0541bf-85c8-4d7f-b1df-beaeea19ff5b",
            "email": "christophe.haen@cern.ch",
            "exp": 1680613292,
            "iat": 1680612692,
            "iss": "https://iam-auth.web.cern.ch/",
            "jti": "38dbb060-19ad-4a77-9c54-15901b96e286",
            "kid": "rsa1",
            "name": "Christophe Haen",
            "organisation_name": "lhcb",
            "preferred_username": "chaen",
            "sub": "b824d4dc-1f9d-4ee8-8df5-c0ae55d46041",
            "wlcg.ver": "1.0",
        },
        "user2": {
            "aud": "5c0541bf-85c8-4d7f-b1df-beaeea19ff5b",
            "email": "albdr@email.com",
            "exp": 1680613292,
            "iat": 1680612692,
            "iss": "https://iam-auth.web.cern.ch/",
            "jti": "49ecc171-20be-5b88-0d65-26012c07f397",
            "kid": "rsa1",
            "name": "Albert Durie",
            "organisation_name": "lhcb",
            "preferred_username": "albdr",
            "sub": "c935e5ed-2g0e-5ff9-9eg6-d1bf66e57152",
            "wlcg.ver": "1.0",
        },
    }
    content = id_tokens.get(raw_id_token)
    if not content:
        raise NotImplementedError(raw_id_token)
    return content


async def test_authorization_flow(test_client, auth_httpx_mock: HTTPXMock):
    code_verifier = secrets.token_hex()
    code_challenge = (
        base64.urlsafe_b64encode(hashlib.sha256(code_verifier.encode()).digest())
        .decode()
        .replace("=", "")
    )

    r = test_client.get(
        "/api/auth/authorize",
        params={
            "response_type": "code",
            "code_challenge": code_challenge,
            "code_challenge_method": "S256",
            "client_id": DIRAC_CLIENT_ID,
            "redirect_uri": "http://diracx.test.invalid:8000/api/docs/oauth2-redirect",
            "scope": "vo:lhcb property:NormalUser",
            "state": "external-state",
        },
        follow_redirects=False,
    )
    assert r.status_code == 307, r.text
    query_parameters = parse_qs(urlparse(r.headers["Location"]).query)
    redirect_uri = query_parameters["redirect_uri"][0]
    state = query_parameters["state"][0]

    # Check that an invalid code returns an error
    r = test_client.get(redirect_uri, params={"code": "invalid-code", "state": state})
    assert r.status_code == 401, r.text

    # Check that an invalid state returns an error
    r = test_client.get(
        redirect_uri, params={"code": "invalid-code", "state": "invalid-state"}
    )
    assert r.status_code == 400, r.text
    assert "Invalid state" in r.text

    # See if a valid code works
    r = test_client.get(
        redirect_uri,
        params={"code": "valid-code", "state": state},
        follow_redirects=False,
    )
    assert r.status_code == 307, r.text
    assert urlparse(r.headers["Location"]).netloc == "diracx.test.invalid:8000"
    assert urlparse(r.headers["Location"]).path == "/api/docs/oauth2-redirect"
    query_parameters = parse_qs(urlparse(r.headers["Location"]).query)
    assert query_parameters["state"][0] == "external-state"
    code = query_parameters["code"][0]

    # Get and check token
    request_data = {
        "grant_type": "authorization_code",
        "code": code,
        "state": state,
        "client_id": DIRAC_CLIENT_ID,
        "redirect_uri": "http://diracx.test.invalid:8000/api/docs/oauth2-redirect",
        "code_verifier": code_verifier,
    }
    _get_and_check_token_response(
        test_client,
        request_data=request_data,
    )

    # Ensure the token request doesn't work a second time
    r = test_client.post("/api/auth/token", data=request_data)
    assert r.status_code == 400, r.json()
    assert r.json()["detail"] == "Code was already used"


async def test_device_flow(test_client, auth_httpx_mock: HTTPXMock):
    # Initiate the device flow (would normally be done from CLI)
    r = test_client.post(
        "/api/auth/device",
        params={
            "client_id": DIRAC_CLIENT_ID,
            "audience": "Dirac server",
            "scope": "vo:lhcb group:lhcb_user property:FileCatalogManagement property:NormalUser",
        },
    )
    assert r.status_code == 200, r.json()
    data = r.json()
    assert data["user_code"]
    assert data["device_code"]
    assert data["verification_uri_complete"]
    assert data["verification_uri"]
    assert data["expires_in"] == 600

    # Check that token requests return "authorization_pending"
    r = test_client.post(
        "/api/auth/token",
        data={
            "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
            "device_code": data["device_code"],
            "client_id": DIRAC_CLIENT_ID,
        },
    )
    assert r.status_code == 400, r.json()
    assert r.json()["error"] == "authorization_pending"

    # Open the DIRAC login page and ensure it redirects to the IdP
    r = test_client.get(data["verification_uri_complete"], follow_redirects=False)
    assert r.status_code == 307, r.text
    login_url = r.headers["Location"]
    assert "/authorize?response_type=code" in login_url
    query_parameters = parse_qs(urlparse(login_url).query)
    redirect_uri = query_parameters["redirect_uri"][0]
    state = query_parameters["state"][0]

    # Check that an invalid code returns an error
    r = test_client.get(redirect_uri, params={"code": "invalid-code", "state": state})
    assert r.status_code == 401, r.text

    # Check that an invalid state returns an error
    r = test_client.get(
        redirect_uri, params={"code": "invalid-code", "state": "invalid-state"}
    )
    assert r.status_code == 400, r.text
    assert "Invalid state" in r.text

    # See if a valid code works
    r = test_client.get(redirect_uri, params={"code": "valid-code", "state": state})
    assert r.status_code == 200, r.text
    assert "Please close the window" in r.text

    # Ensure a valid code does not work a second time
    r = test_client.get(redirect_uri, params={"code": "valid-code", "state": state})
    assert r.status_code == 400, r.text

    # Get and check token
    request_data = {
        "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
        "device_code": data["device_code"],
        "client_id": DIRAC_CLIENT_ID,
    }
    _get_and_check_token_response(
        test_client,
        request_data=request_data,
    )

    # Ensure the token request doesn't work a second time
    r = test_client.post("/api/auth/token", data=request_data)
    assert r.status_code == 400, r.json()
    assert r.json()["detail"] == "Code was already used"


async def test_refresh_token_rotation(test_client, auth_httpx_mock: HTTPXMock):
    """Test the refresh token rotation.
    - initiate a device code flow to get an initial refresh token
    - use the refresh token to get a new access token
    - make sure that the initial refresh token is different from the new one (refresh token rotation
    - act as a malicious attacker providing an old refresh token and make sure it has been revoked
    - make sure the user needs to reauthenticate to get a new refresh token
    - last attempt, try to get a refresh token from a non-existing refresh token
    """
    initial_refresh_token = _get_tokens(test_client)["refresh_token"]

    # ...
    # A malicious attacker manages to steal the initial refresh token of the user
    # ...

    # Malicious attacker gets a new refresh token (to get an access token)
    request_data = {
        "grant_type": "refresh_token",
        "refresh_token": initial_refresh_token,
        "client_id": DIRAC_CLIENT_ID,
    }
    response_data = _get_and_check_token_response(
        test_client, request_data=request_data
    )
    new_refresh_token = response_data["refresh_token"]

    # Make sure it is different from the initial refresh token
    assert initial_refresh_token != new_refresh_token

    # ...
    # User is not aware of the malicious attack
    # User works with an access token until expiration, then needs to get a new one
    # ...

    # User uses the initial refresh token to get a new one
    # The server should detect the breach and revoke every token bound to User
    r = test_client.post("/api/auth/token", data=request_data)
    data = r.json()
    assert r.status_code == 400, data
    assert (
        data["detail"]
        == "Revoked refresh token reused: potential attack detected. You must authenticate again"
    )

    # Make sure that Malicious attacker cannot get a new refresh token from the latest refresh token obtained
    # In theory, new_refresh_token has not been revoked since it is the latest one
    # But because a breach was detected, it should also be revoked
    request_data["refresh_token"] = new_refresh_token
    r = test_client.post("/api/auth/token", data=request_data)
    data = r.json()
    assert r.status_code == 400, data
    assert (
        data["detail"]
        == "Revoked refresh token reused: potential attack detected. You must authenticate again"
    )


async def test_refresh_token_expired(
    test_client, test_auth_settings: AuthSettings, auth_httpx_mock: HTTPXMock
):
    """Test the expiration date of the passed refresh token.
    - get a refresh token
    - decode it and change the expiration time
    - recode it (with the JWK of the server)
    """
    # Get refresh token
    initial_refresh_token = _get_tokens(test_client)["refresh_token"]

    # Decode it
    refresh_payload = jwt.decode(
        initial_refresh_token, options={"verify_signature": False}
    )

    # Modify the expiration time (utc now - 5 hours)
    refresh_payload["exp"] = int((datetime.utcnow() - timedelta(hours=5)).timestamp())

    # Encode it differently
    new_refresh_token = create_token(refresh_payload, test_auth_settings)

    request_data = {
        "grant_type": "refresh_token",
        "refresh_token": new_refresh_token,
        "client_id": DIRAC_CLIENT_ID,
    }

    # Try to get a new access token using the invalid refresh token
    # The server should detect that it is not encoded properly
    r = test_client.post("/api/auth/token", data=request_data)
    data = r.json()
    assert r.status_code == 401, data
    assert data["detail"] == "Invalid JWT: expired_token: The token is expired"


async def test_refresh_token_invalid(test_client, auth_httpx_mock: HTTPXMock):
    """Test the validity of the passed refresh token.
    - get a refresh token
    - decode it and recode it with a different JWK key
    """
    # Get refresh token
    initial_refresh_token = _get_tokens(test_client)["refresh_token"]

    # Decode it
    refresh_payload = jwt.decode(
        initial_refresh_token, options={"verify_signature": False}
    )

    # Encode it differently (using another algorithm)
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        # DANGER: 512-bits is a bad idea for prod but makes the test notably faster!
        key_size=512,
    )
    pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode()

    new_auth_settings = AuthSettings(
        token_key=pem,
        allowed_redirects=[
            "http://diracx.test.invalid:8000/api/docs/oauth2-redirect",
        ],
    )
    new_refresh_token = create_token(refresh_payload, new_auth_settings)

    # Make sure it is different from the initial refresh token
    assert initial_refresh_token != new_refresh_token

    request_data = {
        "grant_type": "refresh_token",
        "refresh_token": new_refresh_token,
        "client_id": DIRAC_CLIENT_ID,
    }

    # Try to get a new access token using the invalid refresh token
    # The server should detect that it is not encoded properly
    r = test_client.post("/api/auth/token", data=request_data)
    data = r.json()
    assert r.status_code == 401, data
    assert data["detail"] == "Invalid JWT: bad_signature: "


async def test_list_refresh_tokens(test_client, auth_httpx_mock: HTTPXMock):
    """Test the refresh token listing with 2 users, a normal one and token manager:
    - normal user gets a refresh token and lists it
    - token manager gets a refresh token and lists all of them
    - normal user renews his/her refresh token and list it: should have only one as the first one should be revoked
    - token manager lists all of them: should still see it as revoked
    """
    # Normal user gets a pair of tokens
    normal_user_tokens = _get_tokens(test_client, property=NORMAL_USER)
    normal_user_access_token = normal_user_tokens["access_token"]
    normal_user_refresh_token = normal_user_tokens["refresh_token"]

    # Normal user lists his/her refresh tokens
    r = test_client.get(
        "/api/auth/refresh-tokens",
        headers={"Authorization": f"Bearer {normal_user_access_token}"},
    )
    data = r.json()
    assert r.status_code == 200, data
    assert len(data) == 1

    # token manager gets a pair of tokens
    token_manager_access_token = _get_tokens(
        test_client, group="lhcb_tokenmgr", property=PROXY_MANAGEMENT
    )["access_token"]

    # Token manager lists refresh tokens: should get his/her own and the normal user's one
    r = test_client.get(
        "/api/auth/refresh-tokens",
        headers={"Authorization": f"Bearer {token_manager_access_token}"},
    )
    data = r.json()
    assert r.status_code == 200, data
    assert len(data) == 2

    # Normal user gets a new refresh token
    request_data = {
        "grant_type": "refresh_token",
        "refresh_token": normal_user_refresh_token,
        "client_id": DIRAC_CLIENT_ID,
    }
    response_data = _get_and_check_token_response(
        test_client, request_data=request_data
    )

    # Normal user lists his/her refresh tokens again
    r = test_client.get(
        "/api/auth/refresh-tokens",
        headers={"Authorization": f"Bearer {response_data['access_token']}"},
    )
    data = r.json()
    assert r.status_code == 200, data
    assert len(data) == 1

    # Token manager lists refresh tokens: should get his/her own and the normal user's one
    r = test_client.get(
        "/api/auth/refresh-tokens",
        headers={"Authorization": f"Bearer {token_manager_access_token}"},
    )
    data = r.json()
    assert r.status_code == 200, data
    assert len(data) == 3


async def test_revoke_refresh_tokens_normal_user(
    test_client, auth_httpx_mock: HTTPXMock
):
    """Test the refresh token revokation with 2 users, a normal one and token manager:
    - normal user gets a refresh token
    - token manager gets a refresh token
    - normal user tries to delete a non-existing RT: should not work
    - normal user tries to delete the token manager's RT: should not work
    - normal user tries to delete his/her RT: should work
    """
    # Normal user gets a pair of tokens
    normal_user_tokens = _get_tokens(test_client, property=NORMAL_USER)
    normal_user_access_token = normal_user_tokens["access_token"]
    normal_user_refresh_token = normal_user_tokens["refresh_token"]
    normal_user_refresh_payload = jwt.decode(
        normal_user_refresh_token, options={"verify_signature": False}
    )

    # Token manager gets a pair of tokens
    token_manager_tokens = _get_tokens(
        test_client, group="lhcb_tokenmgr", property=PROXY_MANAGEMENT
    )
    token_manager_refresh_token = token_manager_tokens["refresh_token"]
    token_manager_refresh_payload = jwt.decode(
        token_manager_refresh_token, options={"verify_signature": False}
    )

    # Normal user tries to delete a random and non-existing RT: should raise an error
    r = test_client.delete(
        "/api/auth/refresh-tokens/does-not-exists",
        headers={"Authorization": f"Bearer {normal_user_access_token}"},
    )
    data = r.json()
    assert r.status_code == 400, data

    # Normal user tries to delete token manager's RT: should not work
    r = test_client.delete(
        f"/api/auth/refresh-tokens/{token_manager_refresh_payload['jti']}",
        headers={"Authorization": f"Bearer {normal_user_access_token}"},
    )
    data = r.json()
    assert r.status_code == 401, data

    # Normal user tries to delete his/her RT: should work
    r = test_client.delete(
        f"/api/auth/refresh-tokens/{normal_user_refresh_payload['jti']}",
        headers={"Authorization": f"Bearer {normal_user_access_token}"},
    )
    data = r.json()
    assert r.status_code == 200, data

    # Normal user tries to delete his/her RT again: should work
    r = test_client.delete(
        f"/api/auth/refresh-tokens/{normal_user_refresh_payload['jti']}",
        headers={"Authorization": f"Bearer {normal_user_access_token}"},
    )
    data = r.json()
    assert r.status_code == 200, data


async def test_revoke_refresh_tokens_token_manager(
    test_client, auth_httpx_mock: HTTPXMock
):
    """Test the refresh token revokation with 2 users, a normal one and token manager:
    - normal user gets a refresh token
    - token manager gets a refresh token
    - token manager tries to delete normal user's RT: should work
    - token manager tries to delete his/her RT: should work too
    """
    # Normal user gets a pair of tokens
    normal_user_tokens = _get_tokens(test_client, property=NORMAL_USER)
    normal_user_refresh_token = normal_user_tokens["refresh_token"]
    normal_user_refresh_payload = jwt.decode(
        normal_user_refresh_token, options={"verify_signature": False}
    )

    # Token manager gets a pair of tokens
    token_manager_tokens = _get_tokens(
        test_client, group="lhcb_tokenmgr", property=PROXY_MANAGEMENT
    )
    token_manager_access_token = token_manager_tokens["access_token"]
    token_manager_refresh_token = token_manager_tokens["refresh_token"]
    token_manager_refresh_payload = jwt.decode(
        token_manager_refresh_token, options={"verify_signature": False}
    )

    # Token manager tries to delete token manager's RT: should work
    r = test_client.delete(
        f"/api/auth/refresh-tokens/{normal_user_refresh_payload['jti']}",
        headers={"Authorization": f"Bearer {token_manager_access_token}"},
    )
    data = r.json()
    assert r.status_code == 200, data

    # Token manager tries to delete his/her RT: should work
    r = test_client.delete(
        f"/api/auth/refresh-tokens/{token_manager_refresh_payload['jti']}",
        headers={"Authorization": f"Bearer {token_manager_access_token}"},
    )
    data = r.json()
    assert r.status_code == 200, data


def _get_tokens(
    test_client, group: str = "lhcb_user", property: SecurityProperty = NORMAL_USER
):
    """Get a pair of tokens (access, refresh) through a device flow code"""
    # User Initiates a device flow (would normally be done from CLI)
    r = test_client.post(
        "/api/auth/device",
        params={
            "client_id": DIRAC_CLIENT_ID,
            "audience": "Dirac server",
            "scope": f"vo:lhcb group:{group} property:FileCatalogManagement property:{property}",
        },
    )
    data = r.json()

    # Open the DIRAC login page and ensure it redirects to the IdP
    r = test_client.get(data["verification_uri_complete"], follow_redirects=False)

    login_url = r.headers["Location"]
    query_parameters = parse_qs(urlparse(login_url).query)
    redirect_uri = query_parameters["redirect_uri"][0]
    state = query_parameters["state"][0]

    r = test_client.get(redirect_uri, params={"code": "valid-code", "state": state})

    # User gets a TokenResponse: should contain an access and a refresh tokens
    r = test_client.post(
        "/api/auth/token",
        data={
            "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
            "device_code": data["device_code"],
            "client_id": DIRAC_CLIENT_ID,
        },
    )
    return r.json()


def _get_and_check_token_response(test_client, request_data):
    """Get a token and check that mandatory fields are present"""
    # Check that token request now works
    r = test_client.post("/api/auth/token", data=request_data)
    assert r.status_code == 200, r.json()
    response_data = r.json()
    assert response_data["access_token"]
    assert response_data["refresh_token"]
    assert response_data["expires_in"]
    assert response_data["token_type"]

    return response_data


@pytest.mark.parametrize(
    "vos, groups, scope, expected",
    [
        [
            ["lhcb"],
            ["lhcb_user"],
            "vo:lhcb group:lhcb_user",
            {"group": "lhcb_user", "properties": ["NormalUser"], "vo": "lhcb"},
        ],
    ],
)
def test_parse_scopes(vos, groups, scope, expected):
    # TODO: Extend test for extra properties
    config = Config.parse_obj(
        {
            "DIRAC": {},
            "Registry": {
                vo: {
                    "DefaultGroup": "lhcb_user",
                    "IdP": {"URL": "https://idp.invalid", "ClientID": "test-idp"},
                    "Users": {},
                    "Groups": {
                        group: {"Properties": ["NormalUser"], "Users": []}
                        for group in groups
                    },
                }
                for vo in vos
            },
            "Operations": {"Defaults": {}},
        }
    )
    available_properties = SecurityProperty.available_properties()
    assert parse_and_validate_scope(scope, config, available_properties) == expected


@pytest.mark.parametrize(
    "vos, groups, scope, expected_error",
    [
        [
            ["lhcb"],
            ["lhcb_user"],
            "group:lhcb_user",
            "No vo scope requested",
        ],
    ],
)
def test_parse_scopes_invalid(vos, groups, scope, expected_error):
    # TODO: Extend test for extra properties
    config = Config.parse_obj(
        {
            "DIRAC": {},
            "Registry": {
                vo: {
                    "DefaultGroup": "lhcb_user",
                    "IdP": {"URL": "https://idp.invalid", "ClientID": "test-idp"},
                    "Users": {},
                    "Groups": {
                        group: {"Properties": ["NormalUser"], "Users": []}
                        for group in groups
                    },
                }
                for vo in vos
            },
            "Operations": {"Defaults": {}},
        }
    )
    available_properties = SecurityProperty.available_properties()
    with pytest.raises(ValueError, match=expected_error):
        parse_and_validate_scope(scope, config, available_properties)
