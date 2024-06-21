//JSON
const jsonPath = 'data/preguntas.json';

//Referencias HTML
const questionContainer = document.querySelector('.trivia-question');
const questionParagraph = document.createElement('p');
const optionContainer = document.querySelector('.trivia-options');

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };

    return array;
};

let correctAnswers = 0;


//Fetch
fetch(jsonPath)
    .then(response => response.json())
    .then(triviaData => {
        //Iniciar con la primera pregunta
        shuffleArray(triviaData);
        let currentQuestionIndex = 0;
        const maxQuestions = 3; // Limitar a 3 preguntas

        const showQuestion = (index) => {

            const triviaItem = triviaData[index];

            //Crea un nuevo elemento P y establece el texto de la pregunta
            const questionElement = document.createElement('p');
            questionElement.textContent = triviaItem.question;

            //Limpia el contenedor de preguntas y añade la nueva pregunta
            questionContainer.innerHTML = '';
            questionContainer.appendChild(questionElement);

            //Limpia el contenedor de opciones
            optionContainer.innerHTML = '';

            //Clases de opciones
            const optionClasses = ['blue-option', 'pink-option', 'green-option', 'dark-option'];

            //Itera sobre cada opción de la pregunta actual
            //Aplico la función shuffleArray para que las opciones se muestren en orden aleatorio
            // shuffleArray(triviaItem.options);
            triviaItem.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('trivia-option');

                // Agrega la clase de color correspondiente

                if (index < optionClasses.length) {
                    optionElement.classList.add(optionClasses[index]);
                }


                const optionText = document.createElement('p');
                optionText.textContent = option.text;

                //Añade el texto a la opción y la opción al contenedor de opciones
                optionElement.appendChild(optionText);
                optionContainer.appendChild(optionElement);

                // Agrega un controlador de eventos de clic a la opción
                optionElement.addEventListener('click', function () {
                    // Verifica si la opción es correcta o no y cambia el color del contenedor en consecuencia
                    if (option.isCorrect) {
                        optionElement.style.backgroundColor = 'green';
                        optionElement.classList.add('correct-option');

                        correctAnswers++;
                    } else {
                        optionElement.style.backgroundColor = 'red';
                        optionElement.classList.add('incorrect-option');
                    }

                    // Deshabilita el clic en todas las opciones
                    const options = document.querySelectorAll('.trivia-option');
                    options.forEach((option) => {
                        option.style.pointerEvents = 'none';
                    });

                    // Espera un segundo, luego pasa a la siguiente pregunta

                    // Agregar referencia al botón .trivia-next
                    const nextButton = document.querySelector('.trivia-next');

                    // Controlador de eventos para el botón .trivia-next
                    nextButton.addEventListener('click', function () {
                        currentQuestionIndex++;
                        if (currentQuestionIndex < maxQuestions + 1) {
                            showQuestion(currentQuestionIndex);
                        } else {
                            // Ocultar el botón .trivia-next
                            nextButton.style.display = 'none';
                            // Mostrar el mensaje de cuántas preguntas se respondieron correctamente
                            questionContainer.innerHTML = '';
                            questionContainer.appendChild(questionParagraph);
                            questionParagraph.innerHTML = `Has respondido correctamente ${correctAnswers} de las últimas ${maxQuestions} preguntas.`;
                            optionContainer.innerHTML = '';
                            // Redireccionar después de 5 segundos
                            setTimeout(() => {
                                window.location.href = 'game.html';
                            }, 5000);
                        }
                    });
                });
            });
        }
        // Muestra la primera pregunta
        showQuestion(currentQuestionIndex);
    })

    .catch(error => {
        console.error('Error:', error);
    });