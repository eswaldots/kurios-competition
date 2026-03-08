package api

import (
	"fmt"
	"net/http"
)

func DieHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello from Go")
}
