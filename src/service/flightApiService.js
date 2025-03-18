export function fetchFlight(id) {
    return fetch("http://localhost:8080/api/flights/" + id)
        .then(response => {
            return response.json()
        })
}

export function fetchAll() {
    return fetch("http://localhost:8080/api/flights")
        .then(response=> {
            return response.json()
        })
}