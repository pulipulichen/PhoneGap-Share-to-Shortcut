<?php
if (isset($_POST["data"])) {
    $data = $_POST["data"];
    file_put_contents("data.json", $data);
}