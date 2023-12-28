<?php
// Your existing PHP code with modifications for sorting
$servername = "127.0.0.1"; 
$username = "root"; 
$password = "";
$dbname = "comment";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        $sortOrder = isset($_GET['sort']) && $_GET['sort'] === 'asc' ? 'ASC' : 'DESC';
    
        $query = "SELECT * FROM comment_table ORDER BY created_at $sortOrder";
        $result = $conn->query($query);
    
        $comments = array();
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $comments[] = $row;
            }
        }
        echo json_encode($comments);
        break;
    

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $name = $data['name'];
        $user_comment = $data['user_comment'];

        $query = "INSERT INTO comment_table (name, user_comment) VALUES ('$name', '$user_comment')";
        if ($conn->query($query)) {
            echo "comment added successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;
    
    case 'OPTIONS':
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PATCH"); 
        header("Access-Control-Allow-Headers: Content-Type");
        header("HTTP/1.1 200 OK");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

$conn->close();
?>
