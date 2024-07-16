import express, { Express, Request, Response, NextFunction } from "express";
import Database from "./database";
import multer from "multer"
import AgbCode from "./models/agbCodes.model";
import { parseCsv } from "./functions/parseCsv";
import { searchAgbCodes } from "./services/agbCode.service";
import { generateToken, verifyPassword } from "./functions/jwt";
import { authenticateUser } from "./middleware/authenticate";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = require('./swagger.json');


export const app: Express = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(morgan("tiny"));
app.use(express.static("public"));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // format error
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world!");
});

//* */
// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



app.post('/upload-csv', upload.single('csvfile'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const csvData = req.file.buffer.toString();
    const { faultyRows, upsertRows } = parseCsv(csvData)

    if (upsertRows.length === 0) {
        res.status(400).json({ message: 'There is a format error in the csv file' });
        return
    }

    try {
        // Save data into database
        await Promise.all(upsertRows.map(async (row) => {
            await AgbCode.upsert(row, { conflictWhere: { agbCode: row.agbCode } });
        }));


        if (faultyRows.length === 0) {
            // Return 202 Accepted status
            res.status(202).json({ message: 'Data received and saved to database' });
        } else {
            res.status(202).json({ message: `There are some data cannot be saved. They have some format error. These are the unsaved data: ${JSON.stringify(faultyRows)}` });
        }
    } catch (err) {
        console.error('Error saving data to database:', err);
        res.status(500).json({ message: 'Failed to save data to database' });
    }
});

app.get('/search', authenticateUser, async (req: Request, res: Response) => {
    if (req.user?.identity !== 'admin') {
        return res.status(403).json({ message: 'You are not permitted for search' })
    }
    const searchQuery = req.query.q as string;

    const searchResults = await searchAgbCodes(searchQuery)
    res.json(searchResults);
});

app.get('/getProfile/:id', authenticateUser, async (req: Request, res: Response) => {
    if (req.user?.identity !== 'user') {
        return res.status(403).json({ message: 'You are not permitted for get profile' })
    }
    if (req.user?.userId !== req.params.id) {
        return res.status(403).json({ message: 'You are not permitted for get this profile' })
    }
    const user = await AgbCode.findOne({ where: { agbCode: req.user.userId } })
    if (!user) {
        return res.status(404).json({ message: 'Profile could not be found' })
    }

    res.json(user)
    res.status(200)
})

app.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(username)
    try {
        const isValid = await verifyPassword(username, password);

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (username !== 'admin') {
            const user = await AgbCode.findOne({ where: { agbCode: username } })
            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
        }
        const identity = username === 'admin' ? 'admin' : 'user'
        const token = generateToken(username, identity);
        res.header({
            "Access-Control-Allow-Credentials": true
        })
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





app.listen(port, () => {

    const db = new Database();
    db.sequelize?.sync();

    console.log(`[server]: Server is running at http://localhost:${port}`);
});
