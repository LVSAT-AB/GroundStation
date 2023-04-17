const fs = require('fs');
const path = require('path');
const os = require('os')
const ChartJsImage = require('chartjs-to-image');

//Define context / references for de divs in index.html
const ctxTemp = document.querySelector('#temp');
const ctxAlt = document.querySelector('#alt');
const ctxPrs = document.querySelector('#prs')

async function getFile() {
    let file = await fetch(path.join(os.homedir(), 'Desktop/LVSAT_EXPORT.txt'));
    file = await file.text();

    file = file.slice(0, file.length - 1)
    let packet = file.split(',')
    let separatedPackets = new Array;



    packet.forEach(item => {
        separatedPackets.push(item.slice(11).split('Z'))
    });

    let timeStamps = new Array;
    let data = new Array;



    separatedPackets.forEach((packet) => {
        timeStamps.push(packet[0])
        data.push(packet[1]);
    })


    let alt = new Array, temp = new Array, prs = new Array;
    data.forEach((val) => {
        temp.push(val.split('_')[0])
        alt.push(val.split('_')[1])
        prs.push(val.split('_')[2])

    })

    let tempChart = new Chart(ctxTemp, {
        type: 'line',
        data: {
            labels: timeStamps,
            datasets: [{
                label: "TEMPERATURE",
                data: temp,
                borderColor: '#ff0000',
                backgroundColor: 'red'
            }],

        },
        options: {
            animation: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    let altChart = new Chart(ctxAlt, {
        type: 'line',
        data: {
            labels: timeStamps,
            datasets: [{
                label: "ALT",
                data: alt,
                borderColor: '#39ff39',
                backgroundColor: '#39ff39',
            }],

        },
        options: {
            animation: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    let prsChart = new Chart(ctxPrs, {
        type: 'line',
        data: {
            labels: timeStamps,
            datasets: [{
                label: "PRS",
                data: prs,
                borderColor: '#00ffff',
                backgroundColor: '#00ffff',
            }],

        },
        options: {
            animation: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    let altImg = altChart.toBase64Image('image/jpeg', 1);
    let tempImg = tempChart.toBase64Image('image/jpeg', 1);
    let prsImg = prsChart.toBase64Image('image/jpeg', 1);

    setTimeout(() => {
        let d = new Date;
        let t = d.getTime();
        let pathAlt = path.join(os.homedir(), 'Desktop', t.toString() + 'alt.jpg');
        fs.appendFile(pathAlt, altImg, function (err) { if (err) { alert(err) } })
    }, 100)

    setTimeout(() => {
        let d = new Date;
        let t = d.getTime();
        let pathTemp = path.join(os.homedir(), 'Desktop', t.toString() + 'temp.jpg');
        fs.appendFile(pathTemp, tempImg, function (err) { if (err) { alert(err) } })
    }, 100)

    setTimeout(() => {
        let d = new Date;
        let t = d.getTime();
        let pathTemp = path.join(os.homedir(), 'Desktop', t.toString() + 'prs.jpg');
        fs.appendFile(pathTemp, prsImg, function (err) { if (err) { alert(err) } })
    }, 200)






}
getFile();