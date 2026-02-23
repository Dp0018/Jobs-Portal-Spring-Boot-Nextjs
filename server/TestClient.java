import com.google.genai.Client;
public class TestClient {
    public static void main(String[] args) {
        Client c = Client.builder().apiKey("foo").build();
    }
}
