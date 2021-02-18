$ = jQuery;

let a = getRandomInt(1, 10);
let b = getRandomInt(1, 10);
var isCapcha = false;

$(() => {
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
    isCapcha = captchaСheck(
      a,
      b,
      parseInt($(thisForm).find('[name = "captcha-input"]').val())
    );
    if (!isCapcha) {
      // если ошибка, то меняю a и b, удаляю все что было в input
      $(thisForm).find('[name = "error-msg"]')[0].style.display = "block";
      newCaptcha();
      return;
    }

    let submitData = {
      action: "post_message",
      user_login: $(thisForm).find('[name = "user_login"]').val(),
      user_email: $(thisForm).find('[name = "user_email"]').val(),
      title: $(thisForm).find('[name = "title"]').val(),
      text: $(thisForm).find('[name = "text"]').val(),
    };

    formSubmit(thisForm, Fields, submitData);
    newCaptcha();
  });
});

/**
 *
 * Functions.
 *
 */

// Получем новые a,b, чистим input, и меняем textContent
function newCaptcha() {
  a = getRandomInt(1, 10);
  b = getRandomInt(1, 10);
  $("#captcha-value-label")[0].textContent = `${a} + ${b} = ?`;
  $("#captcha-input")[0].value = "";
}

// выбор случайных int чисел
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

function captchaСheck(a, b, input) {
  if (a + b == input) {
    return true;
  }
  return false;
}

const formSubmit = (Form, Fields, postData) => {
  let formErrors = validateData(Form, Fields);
  if (formErrors.length > 0) {
    console.log("ERR1", formErrors);
    alert(parseErrors(formErrors));
  } else {
    $.ajax({
      url: _ajax.url, // обработчик
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

const validateCaptcha = (Value, Input_value) => {
  if (Value == Input_value) {
    return true;
  }
  return false;
};

const validateData = (Form, Fields) => {
  let errors = [];

  let formData = Form.serializeArray();

  $.each(formData, (k, v) => {
    if (v.name in Fields) {
      $.each(Fields[v.name], (idx, item) => {
        if (item.check(v.value) === false) {
          errors.push({ name: v.name, message: item.message });
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
