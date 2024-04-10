//Referencias HTML
const btnInicio = document.querySelector('.btn-inicio');



//Eventos
btnInicio.addEventListener('click', () => {
    setTimeout(() => {
        window.location.href = 'trivia.html';
    }, 500);
});