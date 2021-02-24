$ = jQuery;

$(() => {
    let a = getRandomInt(1, 10);
    let b = getRandomInt(1, 10);

    $(document).ready(() => {
        let thisForm = $("form");

        $(thisForm).find(
            '[name = "captcha-value"]'
        )[0].textContent = `${a} + ${b} = ?`;
    });

    $("form").on("submit", (e) => {
        e.preventDefault();
        let thisForm = $(e.currentTarget);

        //lable ошибки -> display: none;
        $(thisForm).find('[name = "error-msg"]')[0].style.display = "none";

        //проверка на капчу
        if (!(a + b == parseInt($(thisForm).find('[name = "captcha-input"]').val()))) {
            $(thisForm).find('[name = "error-msg"]')[0].style.display = "block";
            a = getRandomInt(1, 10);
            b = getRandomInt(1, 10);

            $("#captcha-value-label")[0].textContent = `${a} + ${b} = ?`;

            $("#captcha-input")[0].value = "";
            return;
        }

        let submitData = {
            action: "post_message",
            user_login: $(thisForm).find('[name = "user_login"]').val(),
            user_email: $(thisForm).find('[name = "user_email"]').val(),
            title: $(thisForm).find('[name = "title"]').val(),
            text: $(thisForm).find('[name = "text"]').val(),
            a_random_int: a,
            b_random_int: b,
            user_input_captcha: $(thisForm).find('[name = "captcha-input"]').val(),
        };

        formSubmit(thisForm, Fields, submitData);

        a = getRandomInt(1, 10);
        b = getRandomInt(1, 10);

        $("#captcha-value-label")[0].textContent = `${a} + ${b} = ?`;

        $("#captcha-input")[0].value = "";
    });
});

/**
 *
 * Functions.
 *
 */

// выбор случайных int чисел
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

const formSubmit = (Form, Fields, postData) => {

    let formErrors;
    formErrors = validateData(Form, Fields);
    if (formErrors.length > 0) {
        console.log("ERR1", formErrors);
        alert(parseErrors(formErrors));
    } else {
        $.ajax({
            url: MyCustomAjax.ajaxurl, // обработчик
            action: "post_message",
            data: postData, // данные
            dataType: "JSON",
            type: "POST", // тип запроса
            success: function (data) {
                // console.log(data);
                alert(data.data);
            },
            error: function (data) {
                alert(data.data);
            },
        });
    }
};


const validateData = (Form, Fields) => {
    
    let errors = [];

    let formData = Form.serializeArray();

    $.each(formData, (k, v) => {
        if (v.name in Fields) {
            $.each(Fields[v.name], (idx, item) => {
                if (item.check(v.value) === false) {
                    errors.push({name: v.name, message: item.message});
                }
            });
            console.log(Fields);
        }
    });
    // console.log(Fields);
    return errors;
};

const notEmpty = (value) => {
    if (value.length === 0 || !value.trim()) {
        return false;
    } else {
        return true;
    }
};

const validEmail = (email) => {

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const parseErrors = (errors) => {

    let msg = "";
    $.each(errors, (k, v) => {
        msg = msg + v.message + "\n";
    });
    return msg;
};

/**
 *
 * Fields.
 *
 */

const Fields = {
    user_login: [
        {
            check: notEmpty,
            message: "Please provide valid username",
        },
    ],
    user_email: [
        {
            check: validEmail,
            message: "Please proivde valid email",
        },
        {
            check: notEmpty,
            message: "Email can not be empty",
        },
    ],
    title: [
        {
            check: notEmpty,
            message: "Please add title to your message",
        },
    ],
    text: [
        {
            check: notEmpty,
            message: "Message should not me empty",
        },
    ],
};
