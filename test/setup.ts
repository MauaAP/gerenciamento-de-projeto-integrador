// Arquivo de setup para testes unitários
import "dotenv/config";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
