let clock = document.querySelector('#clock');

setInterval(() => {
    let date = new Date;
    let hour = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();

    hour < 10 ? hour = '0' + hour : hour = hour
    mins < 10 ? mins = '0' + mins : mins = mins
    secs < 10 ? secs = '0' + secs : secs = secs

    clock.innerHTML = hour + ' : ' + mins + ' : ' + secs

}, 950)