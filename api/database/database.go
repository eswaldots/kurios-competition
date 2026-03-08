package db

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

type Database struct {
	*sql.DB
}

func Init() (*sql.DB, error) {
	url := os.Getenv("TURSO_DATABASE_URL")
	token := os.Getenv("TURSO_AUTH_TOKEN")

	return sql.Open("libsql", fmt.Sprintf("%s?authToken=%s", url, token))
}
