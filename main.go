package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Bio struct {
	Name    string `json:"name"`
	Age     int    `json:"age"`
	Country string `json:"country"`
	Job     string `json:"job"`
	Email   string `json:"email"`
}

type Project struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Link        string `json:"link"`
}

func home(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "templates/index.html")
}

func bio(w http.ResponseWriter, r *http.Request) {
	myBio := Bio{
		Name:    "Timileyin Moses",
		Age:     25,
		Country: "Nigeria",
		Job:     "Backend Developer & CMS Specialist",
		Email:   "timileyinfiv@gmail.com",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(myBio)
}

func projects(w http.ResponseWriter, r *http.Request) {
	myProjects := []Project{
		{Title: "Portfolio Website", Description: "My personal portfolio built with Go", Link: "https://github.com"},
		{Title: "Bio API", Description: "A REST API built with Go", Link: "https://github.com"},
		{Title: "Travels & Tour Website", Description: "Built a user-friendly tour showcase website for Moultontoursja.com in Jamaica with booking functionality using WordPress.", Link: "https://www.behance.net/timileyinmoses_157"},
		{Title: "Online Store - Sonnies Collection", Description: "Built a full ecommerce store for a USA-based fashion brand using Shopify.", Link: "https://www.behance.net/timileyinmoses_157"},
		{Title: "SrGlobe Content Management", Description: "Managed and built user-friendly websites for SrGlobe.UK using WordPress CMS.", Link: "https://www.linkedin.com/in/moses-timileyin-044511269"},
		{Title: "Vacation Rental Website", Description: "Designed and developed a fully functional vacation rental website, integrated with major booking platforms including Airbnb, Expedia, and Booking.com for seamless property listings.", Link: "https://www.behance.net/timileyinmoses_157"},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(myProjects)
}

func main() {
	http.HandleFunc("/", home)
	http.HandleFunc("/api/bio", bio)
	http.HandleFunc("/api/projects", projects)
	fmt.Println("Server starting on port 8080...")
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.ListenAndServe(":8080", nil)
}
