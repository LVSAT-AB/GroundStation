const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')
const fs = require('fs');
const path = require('path');
const os = require('os')

const socket = io.connect('http://localhost:3000')


let com = localStorage.getItem('COM');
let bps = parseInt(localStorage.getItem('BPS'));


if (com == undefined || bps == undefined) {
    alert('CONF COM / BPS');
    window.location.replace('../index/index.html')
}

const port = new SerialPort({
    path: com,
    baudRate: bps
})

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

let pit = document.querySelector('.pit');
let rol = document.querySelector('.rol');
let yaw = document.querySelector('.yaw');
let hdg = document.querySelector('#hdg')
let alti = document.querySelector('.alt');
let temp = document.querySelector('#tat');
let prs = document.querySelector('#prs');
let spd = document.querySelector('.spd');
let crs = document.querySelector('#crs');
let gs = document.querySelector('#gs')
let alt;
let bank = 0;

var first_attitude = $.flightIndicator('#first_attitude', 'attitude', {
    size: 350,
    roll: 8,
    pitch: 3,
    showBox: true
});
// Dynamic examples
var attitude = $.flightIndicator('#attitude', 'attitude', {
    /*roll: 50,
    pitch: -20,
    size: 200,
    showBox: true*/
});
var heading = $.flightIndicator('#heading', 'heading', {
    heading: 0,
    showBox: true
});

function playAudio(aud) {
    
    
    let pth = path.join(__dirname, '../../', 'sound', aud+'.wav')
    let audio = new Audio(pth);
    audio.play()
    console.log(pth)
}

let Fpath = path.join(os.homedir(),  'Desktop/LVSAT_EXPORT.txt');
console.log(Fpath)
let dataReceived = '';


const fileDescriptor = fs.openSync(Fpath, 'w');


let t = parser.on('data', (data) => {
    let m = data;
    socket.emit('actualizarDatos', m);

    let a = m.split('_')



    if (data.slice(0, 5) == 'LVSAT') {
        a.forEach((item) => {
            let da = item.slice(3);
            let content;
            switch (item.slice(0, 3)) {
                case 'ROL':
                    attitude.setRoll(item.slice(3));
                    if (bank == 0 && parseFloat(item.slice(3)) >= 45) {
                        playAudio('bank')
                        bank = 1;
                        
                        break;
                    } else if (parseFloat(item.slice(3)) <= 45) {
                        bank = 0;
                    }

                    if (bank == 0 && parseFloat(item.slice(3)) <= -45) {
                        playAudio('bank')
                        bank = 1;
                        
                        break;
                    } else if (parseFloat(item.slice(3)) >= -45) {
                        bank = 0;
                    }

                    break;
                case 'PIT':
                    attitude.setPitch(da);
                    break;
                case 'HDG':
                    heading.setHeading(da);
                    da = -da;
                    da = Math.round(da)

                    if (da < 0) {
                        da = da + 360;
                        hdg.innerHTML = da
                    } else {
                        hdg.innerHTML = da
                    }
                    break;
                case 'PRS':
                    da = da.slice(0, -1)
                    prs.innerHTML = da;
                    break;
                case 'TAT':
                    da = da.slice(0, -1)
                    temp.innerHTML = da;



                    break;
                case 'ALT':
                    //da = da.slice(0,-1)
                    da = parseFloat(da);
                    da = Math.round(da);
                    alti.innerHTML = da;


                    content = da;

                    if (content <= 1000 && content > 500 && alt != 1000) { playAudio('1000'); alt = 1000 } else
                        if (content <= 500 && content > 400 && alt != 500) { playAudio('500'); alt = 500 } else
                            if (content <= 400 && content > 300 && alt != 400) { playAudio('400'); alt = 400 } else
                                if (content <= 300 && content > 200 && alt != 300) { playAudio('300'); alt = 300 } else
                                    if (content <= 200 && content > 100 && alt != 200) { playAudio('200'); alt = 200 } else
                                        if (content == 100 && alt != 100) { playAudio('100'); alt = 100 } else
                                            if (content <= 70 && content > 60 && alt != 70) { playAudio('70'); alt = 70 } else
                                                if (content <= 60 && content > 50 && alt != 60) { playAudio('60'); alt = 60 } else
                                                    if (content <= 50 && content > 40 && alt != 50) { playAudio('50'); alt = 50 } else
                                                        if (content <= 40 && content > 30 && alt != 40) { playAudio('Minimum'); alt = 40 } else
                                                            if (content <= 30 && content > 20 && alt != 30) { playAudio('30'); alt = 30 } else
                                                                if (content <= 20 && content > 10 && alt != 20) { playAudio('20'); alt = 20 } else
                                                                    if (content <= 10 && content > 5 && alt != 10) { playAudio('10'); alt = 10 } else
                                                                        if (content < 100 && content > 70 && alt != 99) { playAudio('100Above'); alt = 99 } else
                                                                            if (content <= 5 && alt != 5) { playAudio('Retard'); alt = 5 }


                    break;
                case 'CRS':
                    crs.innerHTML = da + 'º';
                    break;


                case 'SPD':
                    gs.innerHTML = da;
                    spd.innerHTML = da;
                    break;
            }
        })

        let d = new Date;
        let time = d.getTime()
        time = d.toISOString();
        let msgf = time + temp.innerHTML + '_' + alti.innerHTML + '_' + prs.innerHTML + ',';
        dataReceived += msgf


        fs.appendFileSync(fileDescriptor, dataReceived);

        // Limpiar los datos recibidos después de escribirlos en el archivo
        dataReceived = '';


    }


})

