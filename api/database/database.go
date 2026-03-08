package db

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

func GetDB() *sql.DB {
	url := os.Getenv("TURSO_DATABASE_URL")
	token := os.Getenv("TURSO_AUTH_TOKEN")

	db, err := sql.Open("libsql", fmt.Sprintf("%s?authToken=%s", url, token))

	if err != nil {
		fmt.Println("Error opening db connection")
	}

	return db
}
