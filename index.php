<?php

/**
 * @subpackage testovoe
 * @since testovoe
 */
?>

<!DOCTYPE html>
<html lang="ru">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Тестовое задание</title>
    <meta name="robots" content="noindex,nofollow">
    <meta name="generator" content="WordPress 5.6.1">
    <?php get_header(); ?>
</head>

<body class="home blog">
    <form class="decor" novalidate="">
        <div class="form-left-decoration"></div>
        <div class="form-right-decoration"></div>
        <div class="circle"></div>
        <div class="form-inner">
            <h3>Добавить запись</h3>
            <input type="text" name="user_login" placeholder="Username" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4EaVTO26DQBD1ohQWaS2lg9JybZ+AK7hNwx2oIoVf4UPQ0Lj1FdKktevIpel8AKNUkDcWMxpgSaIEaTVv3sx7uztiTdu2s/98DywOw3Dued4Who/M2aIx5lZV1aEsy0+qiwHELyi+Ytl0PQ69SxAxkWIA4RMRTdNsKE59juMcuZd6xIAFeZ6fGCdJ8kY4y7KAuTRNGd7jyEBXsdOPE3a0QGPsniOnnYMO67LgSQN9T41F2QGrQRRFCwyzoIF2qyBuKKbcOgPXdVeY9rMWgNsjf9ccYesJhk3f5dYT1HX9gR0LLQR30TnjkUEcx2uIuS4RnI+aj6sJR0AM8AaumPaM/rRehyWhXqbFAA9kh3/8/NvHxAYGAsZ/il8IalkCLBfNVAAAAABJRU5ErkJggg==&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%; cursor: auto;">
            <input type="email" name="user_email" placeholder="Email">
            <input type="text" name="title" placeholder="Title">
            <textarea name="text" placeholder="Сообщение..." rows="3"></textarea>
            <div class="capthca-value-wrapper">
                <span type="text " name="captcha-value" id="captcha-value-label"></span>
            </div>
            <input type="text" name="captcha-input" id="captcha-input" placeholder="Введите капчу...">
            <label name="error-msg" id="error-msg">Капча введена неверно</label>
            <button type="submit">Отправить</button>
        </div>
    </form>
    <?php include "footer.php"; ?>
</body>

</html>