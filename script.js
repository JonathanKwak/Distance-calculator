
const key = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjBiZDA2YzBlYzhjZDQ0MmE4Njg1NThjOGZmMTZkMzgzIiwiaCI6Im11cm11cjY0In0="
const url = "https://api.openrouteservice.org/v2/matrix/driving-car";

const presets = {
    "Toronto":"43.6532, -79.3832",
    "Montreal":"45.5019, -73.5674",
    "Vancouver":"49.2827, -123.1207",
}

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
    // handle creating the presets so we don't have to manually create them
    for (const key in presets) {
        const $option = $("<option>").val(key).text(key)
        $(".presets").append($option)
    }

    $("#start-presets").val("Toronto");
    $("#end-presets").val("Montreal");

    // handle changes to the drop-down menus
    $("#start-presets").on("change", function() {
        let newVal = $(this).val();
        $("#start").val(presets[newVal])
    })

    $("#end-presets").on("change", function() {
        let newVal = $(this).val();
        $("#end").val(presets[newVal])
    })

    // handle clicking the "Go" button
    $("#go-button").click(function() {
        const start_values = $("#start").val();
        const end_values = $("#end").val();

        let start_coordinates = start_values.split(",")
        let end_coordinates = end_values.split(",")

        // longitude and latitude are flipped because the API said so
        const body = {
            locations: [
                [start_coordinates[1], start_coordinates[0]],
                [end_coordinates[1], end_coordinates[0]]
            ]
        }

        $("#go-button").addClass("hidden")
        $("#loading-text").removeClass("hidden")

        $("#results-area").empty()

        getResults({
            method: "POST",
            headers: {
                "Authorization": key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        .then(data => {
            let duration = data.durations[0][1] // in seconds

            const hours = Math.floor(duration / 3600)
            const minutes = Math.floor((duration % 3600) / 60)
            const seconds = Math.round(duration % 60)

            let text = "This would take you about " + hours + "h " + minutes + "m " + seconds + "s."

            $("#results-area").append(text).addClass("result")
            $("#go-button").removeClass("hidden")
            $("#loading-text").addClass("hidden")
        })
    });
});