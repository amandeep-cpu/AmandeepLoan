<?php

class Database {
    private $host = 'localhost';
    private $db_name = 'amandeep_loan';
    private $user = 'root';
    private $password = '';
    private $conn;

    public function connect() {
        $this->conn = new mysqli(
            $this->host,
            $this->user,
            $this->password,
            $this->db_name
        );

        if ($this->conn->connect_error) {
            die('Connection Error: ' . $this->conn->connect_error);
        }

        return $this->conn;
    }

    public function query($sql) {
        $result = $this->conn->query($sql);
        return $result;
    }

    public function close() {
        $this->conn->close();
    }
}

?>