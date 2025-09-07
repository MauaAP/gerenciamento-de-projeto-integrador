// Arquivo de setup para testes de integração
import "dotenv/config";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
