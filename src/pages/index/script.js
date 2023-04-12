let buttons = document.querySelectorAll('button');
let form = document.querySelector('form');
let com = document.querySelector('#com');
let bps = document.querySelector('#bps');

buttons.forEach((button) => {
    button.addEventListener('click', (btn) => {
        let name = btn.target.innerHTML;
        if (name != 'SEND') { window.location.replace('../' + name + '/index.html') } else {
            localStorage.setItem('COM', com.value);
            localStorage.setItem('BPS', bps.value)
            document.querySelector('form').style.display = 'none'
            document.querySelector('#container').style.display = 'grid'
        }
    })
})

if (localStorage.getItem('BPS') == undefined || localStorage.getItem('BPS') == 'undefined') {
    document.querySelector('form').style.display = 'flex'
    document.querySelector('#container').style.display = 'none'
} else {
    document.querySelector('form').style.display = 'none'
    document.querySelector('#container').style.display = 'grid'
}

window.addEventListener('keydown', (e) => {
    if (e.key == 'x') {
        localStorage.setItem('BPS', undefined);
        window.location.reload();
    }
})