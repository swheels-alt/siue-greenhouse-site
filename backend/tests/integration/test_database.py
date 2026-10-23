"""Smoke test against the MySQL service container in CI (QA plan 3.3, integration level)."""

import os

import pymysql
import pytest

pytestmark = pytest.mark.integration


@pytest.mark.skipif("DB_HOST" not in os.environ, reason="needs the MySQL service; runs in CI")
def test_database_accepts_connections() -> None:
    connection = pymysql.connect(
        host=os.environ["DB_HOST"],
        port=int(os.environ.get("DB_PORT", "3306")),
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"],
    )
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            assert cursor.fetchone() == (1,)
    finally:
        connection.close()
