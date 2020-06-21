// select dropdown menu
var dataset = d3.select("#selDataset");
var index = []
var sample_values;
var names;

var data;
var subjectIDs;

//function to data to the dropdown menu
function dropDown(data, index) {
    click = d3.select(data)
    index.forEach(x => {
        data.append("option").text(x)
    });
}

function demoInfo(subject) {
    d3.json("samples.json").then(function (data) {
        var metadata = data.metadata;
        var results = metadata.filter(a => a.id === parseInt(subject));

        // select Demographic Info box
        var demoInfobox = d3.select("#sample-metadata");

        // clear existing data
        demoInfobox.html("");
        
        // loop through and get each key and value 
        results.forEach((key) => {
            demoInfobox.append("h5").html(
                `id: ${key['id']}<br>
            ethnicity: ${key['ethnicity']}<br>
            gender: ${key['gender']}<br>
            age: ${key['age']}<br>
            location: ${key['location']}<br>
            bbtype: ${key['bbtype']}<br>
            wfreq: ${key['wfreq']}<br>
            `);
        });

    })
}



// function to load dashboard
function buildDash(data, subject, init = false) {
    d3.json("samples.json").then(function (data) {
        var samples = data.samples.filter(b => b.id === subject);

        // sample values 
        var sample_values = samples.map(c => c.sample_values);
        sample_values = sample_values[0];

        // otu ids
        var otu_ids = samples.map(d => d.otu_ids);
        otu_ids = otu_ids[0];
        top_otuIDs = otu_ids.slice(0, 10);
        top_otu_ids = top_otuIDs.map(d => "OTU " + d);

        // otu labels
        var otu_labels = samples.map(e => e.otu_labels);
        otu_labels = otu_labels[0];
        top_otu_labels = otu_labels.slice(0, 10);

        // sort and slice
        var samples_sort = sample_values.sort((a, b) => b - a);
        var topSample_values = samples_sort.slice(0, 10);

        // wash frequency
        var metadata = data.metadata;
        var results = metadata.filter(a => a.id === parseInt(subject));
        var wfreq = results.map(f => f.wfreq);
        wfreq = wfreq[0];
        console.log(wfreq);

        // Trace 1 for bar plot
        var trace1 = {
            x: topSample_values,
            y: top_otu_ids,
            labels: top_otu_ids,
            hovertext: top_otu_labels,
            type: "bar",
            orientation: "h",
            marker: {
                color: "#ff8080"
            },
        };

        var barData = [trace1];
        Plotly.newPlot("bar", barData);

        // Trace 2 for bubble plot
        var trace2 = {
            x: otu_ids,
            y: sample_values,
            type: "scatter",
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: otu_labels
        };
        var bubbleData = [trace2];
        Plotly.newPlot("bubble", bubbleData);

        // trace 3 for gauge meter
        var trace3 = [
            {
                domain: {x: [0, 1], y: [0, 1]}, 
                value: parseInt(wfreq),
                title: {text: "Belly Button Washing Frequency (Scrubs per Week"},
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: {range: [null, 9], tickwidth: 1},
                    bar: {color: "#a64dff"},
                    steps: [
                        {range: [0, 1], color: "#ffb3b3"},
                        {range: [1, 2], color: "#ffb3c6"},
                        {range: [2, 3], color: "#ffb3d9"},
                        {range: [3, 4], color: "#ffb3ec"},
                        {range: [4, 5], color: "#ffb3ff"},
                        {range: [5, 6], color: "#ecb3ff"},
                        {range: [6, 7], color: "#d9b3ff"},
                        {range: [7, 8], color: "#c6b3ff"},
                        {range: [8, 9], color: "#b3b3ff"}, 

                        ]}
            }
        ];

        // gauge layout
        var layout = {
            width: 600, 
            height: 400, 
            margin: {t: 20, b: 40, l: 100, r: 100}
        };

        //plot gauge
        Plotly.newPlot("gauge", trace3, layout);
    })
}



// function called by DOM changes
function optionChanged(data) {
    let dropDownMenu = d3.select("#selDataset");
    let subject = dropDownMenu.property("value");
    // Assign dropdown value to variable
    // Insert new info when user selects new sample 
    buildDash(data, subject);
    demoInfo(data);
}

d3.json("samples.json").then(function (d) {
    // console.log("JSON Data:", d);
    data = d;
    subjectIDs = d.names;
    let dropDownMenu = d3.select("#selDataset");
    let subject = dropDownMenu.property("value");

    d3.json("samples.json").then(function (data) {
        subjectIDs = data.names;
        // console.log(subjectIDs);
        subjectIDs.forEach((name) => {
            dataset.append("option").text(name);
        })

        // Dashboard initialized 
        buildDash(data, subjectIDs[0], init = true);
        demoInfo(subjectIDs[0]);
    })
})

