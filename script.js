
const key = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjBiZDA2YzBlYzhjZDQ0MmE4Njg1NThjOGZmMTZkMzgzIiwiaCI6Im11cm11cjY0In0="
const url = "https://api.openrouteservice.org/v2/matrix/driving-car";

// calls the OpenRouteService API
// note for self: 'await' needs to be in an async function
async function getResults(options) {
    try {
        const result = await fetch(url, options)
        return await result.json()
    } catch (err) {
        console.error(err)
        return {}
    }
}

$(document).ready(function() {
    $("#go-button").click(function(event) {
        // something

        const start_longitude = $("#start-lon").val();
        const start_latitude = $("#start-lat").val();

        const end_longitude = $("#end-lon").val();
        const end_latitude = $("#end-lat").val();

        const body = {
            locations: [
                [ start_longitude, start_latitude ],
                [ end_longitude, end_latitude ]
            ]
        }

        getResults({
            method: "POST",
            headers: {
                "Authorization": key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        .then(data => {
            let duration = data.durations[0][1]
            
            $("#results-area").empty()
            let text = "These two locations would need " + duration + " seconds to travel."
            $("#results-area").append(text).addClass("result")
        })
    });
});