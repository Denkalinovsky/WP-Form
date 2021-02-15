$ = jQuery;
$(() => {
	$('form').on(
		'submit',
		e => {
			e.preventDefault();
			let thisForm = $(e.currentTarget);
			let submitData = {
				"action": 'post_message',
				"user_login": $(thisForm).find('[name = "user_login"]').val(),
				"user_email": $(thisForm).find('[name = "user_email"]').val(),
				"title": $(thisForm).find('[name = "title"]').val(),
				"text": $(thisForm).find('[name = "text"]').val()
			}

			// console.log(_ajax.nonce);
			formSubmit(thisForm, Fields, submitData);
		}
	);
});



/**
 * 
 * Functions.
 * 
 */
const formSubmit = (Form, Fields, postData) => {

	let formErrors = validateData(Form, Fields);
	if (formErrors.length > 0) {
		console.log("ERR1", formErrors);
		alert(parseErrors(formErrors));
	} else {
		$.ajax({
			url: _ajax, // обработчик
			action: "post_message",
			data: postData, // данные
			dataType: 'JSON',
			type: 'POST', // тип запроса
			success: function (data) {
				// console.log(data);
				if (data) {
					alert("Добавлено");
				}
				else {
					alert("Запись не добавлена");
				}
			},
		});
	}
}

const validateData = (Form, Fields) => {

	let errors = [];


	let formData = Form.serializeArray();

	$.each(
		formData,
		(k, v) => {
			if (v.name in Fields) {
				$.each(
					Fields[v.name],
					(idx, item) => {
						if (item.check(v.value) === false) {
							errors.push({
								name: v.name,
								message: item.message
							});

						}
					}
				);
				console.log(Fields);
			}
		}
	);
	// console.log(Fields);
	return errors;
}

const notEmpty = (value) => {
	if ((value.length === 0 || !value.trim())) {
		return false;
	} else {
		return true;
	}
}

const validEmail = (email) => {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

const parseErrors = (errors) => {
	let msg = '';
	$.each(errors, (k, v) => {
		msg = msg + v.message + "\n";
	});
	return msg;
}

/**
 * 
 * Fields.
 * 
 */
const Fields = {
	user_login: [
		{
			check: notEmpty,
			message: "Please provide valid username"
		}
	],
	user_email: [
		{
			check: validEmail,
			message: "Please proivde valid email"
		},
		{
			check: notEmpty,
			message: "Email can not be empty"
		}
	],
	title: [
		{
			check: notEmpty,
			message: "Please add title to your message"
		}
	],
	text: [
		{
			check: notEmpty,
			message: "Message should not me empty"
		}
	]
}