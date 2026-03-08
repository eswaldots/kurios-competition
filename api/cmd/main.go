package handler

import (
	"kurios-competition/api"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("GET /api", api.Handler)

	log.Println("Starting listener... :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
