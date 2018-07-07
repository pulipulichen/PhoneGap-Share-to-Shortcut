<?php
if (isset($_POST["data"])) {
    $data = $_POST["data"];
    $filename = $_GET["filename"];
    file_put_contents($filename . ".json", $data);
}