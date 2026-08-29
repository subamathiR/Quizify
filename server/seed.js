const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Quiz = require('./models/Quiz');
const Attempt = require('./models/Attempt');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Quiz.deleteMany({});
    await Attempt.deleteMany({});

    console.log('Seeding Users...');
    const adminUser = await User.create({
      name: 'Admin Manager',
      email: 'admin@quizify.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Platform Administrator & Content Manager 🛡️'
    });

    const john = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'student123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      bio: 'Full Stack Dev Learner | Python & JS Enthusiast 💻'
    });

    const sarah = await User.create({
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      password: 'student123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      bio: 'Data Science & Machine Learning Student 📊'
    });

    const mike = await User.create({
      name: 'Michael Brown',
      email: 'mike@example.com',
      password: 'student123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Aptitude & Reasoning Specialist 🧠'
    });

    const emily = await User.create({
      name: 'Emily Davis',
      email: 'emily@example.com',
      password: 'student123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      bio: 'Web Developer & UI/UX Aficionado 🎨'
    });

    console.log('Seeding Categories...');
    const categoryConfig = [
      {
        category: "Programming",
        icon: "Code",
        color: "#4F46E5",
        description: "Core programming languages, syntax, and object-oriented paradigms.",
        quizzes: ["C Programming", "C++", "Java", "Python", "JavaScript", "PHP", "OOP Concepts", "Programming Fundamentals"]
      },
      {
        category: "Web Development",
        icon: "Globe",
        color: "#E34F26",
        description: "Frontend, backend, web standards, frameworks, and APIs.",
        quizzes: ["HTML", "CSS", "JavaScript (Web)", "React.js", "Node.js", "Express.js", "Web APIs", "Frontend Development", "Backend Development"]
      },
      {
        category: "Database",
        icon: "Database",
        color: "#00758F",
        description: "Relational, non-relational, normalizations, and data structures.",
        quizzes: ["DBMS", "SQL", "MySQL", "MongoDB", "Database Normalization", "Transactions", "ER Diagrams"]
      },
      {
        category: "DSA",
        icon: "Layers",
        color: "#10B981",
        description: "Data Structures, algorithms, sorting, and optimization.",
        quizzes: ["Arrays", "Strings", "Linked Lists", "Stack", "Queue", "Hashing", "Trees", "Binary Search Trees", "Graphs", "Recursion", "Sorting", "Searching", "Dynamic Programming", "Greedy Algorithms"]
      },
      {
        category: "Computer Science",
        icon: "Cpu",
        color: "#3776AB",
        description: "Systems, networks, compilers, and theoretical computer science.",
        quizzes: ["Operating Systems", "Computer Networks", "Computer Architecture", "Software Engineering", "Compiler Design", "Theory of Computation"]
      },
      {
        category: "AI & Data",
        icon: "Brain",
        color: "#8B5CF6",
        description: "Artificial intelligence, machine learning, data science, and statistics.",
        quizzes: ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Natural Language Processing", "Generative AI", "Data Science", "Data Analytics", "Statistics", "Power BI"]
      },
      {
        category: "Advanced Technology",
        icon: "ShieldAlert",
        color: "#EC4899",
        description: "Cloud computing, security, devops, git, and advanced systems.",
        quizzes: ["Cybersecurity", "Cryptography", "Cloud Computing", "AWS", "Azure", "DevOps", "Git & GitHub", "Blockchain", "Internet of Things"]
      },
      {
        category: "Placement Preparation",
        icon: "Award",
        color: "#F59E0B",
        description: "Aptitude, logical reasoning, verbal ability, and interview preps.",
        quizzes: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Coding Aptitude", "Technical Aptitude", "HR Interview", "Technical Interview"]
      },
      {
        category: "General",
        icon: "Compass",
        color: "#06B6D4",
        description: "General knowledge, history, geography, current affairs, and sciences.",
        quizzes: ["General Knowledge", "General Science", "Indian History", "Geography", "Current Affairs", "Sports", "Technology & Innovation"]
      }
    ];

    const categoriesDataWithSlug = categoryConfig.map(cfg => ({
      name: cfg.category,
      description: cfg.description,
      icon: cfg.icon,
      color: cfg.color,
      slug: cfg.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));

    const createdCategories = await Category.insertMany(categoriesDataWithSlug);

    console.log('Seeding Quizzes and Questions...');
    
    const generateQuestionsForTopic = (topicName, categoryName) => {
      // Define a custom set of 30 high-fidelity questions depending on the domain category
      let templates = [];

      if (categoryName === 'Database') {
        templates = [
          { q: "Which SQL command is classified as a Data Definition Language (DDL) operation in {topic}?", opts: ["SELECT", "INSERT", "TRUNCATE", "UPDATE"], ans: 2, exp: "TRUNCATE is a DDL operation that alters the database schema structure by dropping and recreating the storage table." },
          { q: "In {topic}, what does the Atomicity property of ACID guarantee?", opts: ["All operations of a transaction succeed, or none do", "Database states remain consistent after updates", "Concurrent executions do not conflict", "Data changes are permanent"], ans: 0, exp: "Atomicity ensures the 'all-or-nothing' execution rule for database transactions." },
          { q: "Which normal form in {topic} database design handles transitive dependencies?", opts: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"], ans: 2, exp: "Third Normal Form requires removing transitive functional dependencies on non-candidate keys." },
          { q: "What is the purpose of database indexes in {topic}?", opts: ["To enforce structural encryption", "To speed up query retrieval speeds", "To check data constraint types", "To back up data files"], ans: 1, exp: "Indexes construct helper trees (like B+ Trees) to resolve lookup queries without scanning entire tables." },
          { q: "Which type of JOIN in {topic} returns all records from both tables matching or unmatching?", opts: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], ans: 3, exp: "FULL OUTER JOIN combines left and right rows, filling nulls for non-matching columns." },
          { q: "What is a Foreign Key constraint in {topic} relational design?", opts: ["To establish referential integrity between tables", "To encrypt user passwords", "To check if numerical values are positive", "To create transient variables"], ans: 0, exp: "Foreign keys point to a primary key in another table, guaranteeing consistent relationships." },
          { q: "Which indexing structure is commonly used in {topic} for range queries?", opts: ["Hash Index", "B+ Tree Index", "Linear Array", "Linked List"], ans: 1, exp: "B+ Trees maintain sorted order on leaf nodes, making them highly efficient for range-based retrieval." },
          { q: "What is the key difference between DELETE and TRUNCATE in {topic}?", opts: ["DELETE is logged per row and can be rolled back; TRUNCATE cannot be rolled back easily", "TRUNCATE only deletes tables", "DELETE is a DDL command", "There is no difference"], ans: 0, exp: "DELETE deletes rows sequentially and fires triggers; TRUNCATE drops storage allocations directly." },
          { q: "What does database normalization in {topic} attempt to minimize?", opts: ["Data redundancy and anomaly anomalies", "Query execution speeds", "Data security rules", "Database storage capacity"], ans: 0, exp: "Normalization divides tables to eliminate duplicate entries and insert/delete inconsistencies." },
          { q: "Which isolation level in {topic} protects against phantom reads?", opts: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"], ans: 3, exp: "Serializable isolation places locks on ranges, preventing concurrent insert actions from creating phantom rows." },
          { q: "In {topic}, what does a database view represent?", opts: ["A virtual table based on the result-set of an SQL statement", "A physically cloned database copy", "A file containing backup logs", "A system configuration tool"], ans: 0, exp: "Views are dynamic queries saved in the system, acting as read-only or updatable virtual tables." },
          { q: "What is a trigger in {topic}?", opts: ["A stored procedure invoked automatically upon insert, update, or delete operations", "A graphical button in UI", "A physical key in storage hardware", "A compiler error warning"], ans: 0, exp: "Triggers fire event handlers in response to data modification events." },
          { q: "Which SQL clause is used to filter records after aggregate calculations?", opts: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], ans: 1, exp: "HAVING filters grouped aggregates; WHERE filters raw source rows prior to grouping." },
          { q: "What is a primary key constraint in {topic}?", opts: ["A constraint that uniquely identifies each row and forbids NULL values", "A key to encrypt database logs", "A pointer referencing another table", "None of the above"], ans: 0, exp: "Primary keys are unique, non-null values that index and identify rows." },
          { q: "What is the purpose of database transactions in {topic}?", opts: ["To group multiple SQL operations into a single logical unit of work", "To speed up single row inserts", "To format output text files", "To index text strings"], ans: 0, exp: "Transactions execute operations atomically, maintaining ACID integrity." },
          { q: "Which constraint prevents duplicate values in a {topic} column but allows NULLs?", opts: ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "CHECK"], ans: 2, exp: "UNIQUE constraints enforce distinct values but permit null values, unlike primary keys." },
          { q: "What is a database transaction deadlock in {topic}?", opts: ["A state where two or more transactions are blocked waiting for each other to release locks", "A network crash", "An index duplication error", "A compiled query error"], ans: 0, exp: "Deadlocks happen when processes hold resource locks while waiting to acquire locks held by other waiting processes." },
          { q: "Which database system is classified as NoSQL in {topic} classifications?", opts: ["MySQL", "PostgreSQL", "MongoDB", "Oracle DB"], ans: 2, exp: "MongoDB is a document-oriented NoSQL database storing records in JSON-like BSON formats." },
          { q: "In {topic}, what does database sharding do?", opts: ["Partitions data horizontally across multiple servers", "Partitions data vertically within a single table", "Backs up files to tape storage", "Encrypts column values"], ans: 0, exp: "Sharding distributes database segments horizontally to scale hardware load across servers." },
          { q: "What is a cursor in {topic} SQL scripts?", opts: ["A control structure that enables traversal over query result rows", "A graphical pointer on the desktop", "A database index tree leaf", "A database connection pool"], ans: 0, exp: "Cursors let developers fetch and process query result rows one-by-one inside procedures." },
          { q: "Which normal form requires all non-key attributes to depend solely on the whole primary key?", opts: ["1NF", "2NF", "3NF", "4NF"], ans: 1, exp: "Second Normal Form (2NF) eliminates partial dependencies, requiring fields to depend on the full candidate key." },
          { q: "What does the DBMS schema in {topic} describe?", opts: ["The logical structure and organization of database tables", "The server hardware configurations", "The database backup directory structure", "The network topology mappings"], ans: 0, exp: "Schema defines the structural blueprints, columns, datatypes, and constraints." },
          { q: "What is the role of WAL (Write-Ahead Logging) in {topic}?", opts: ["To write transaction changes to a log before writing them to the database file", "To speed up network lookups", "To index text descriptions", "To render report dashboards"], ans: 0, exp: "WAL ensures database recovery and durability by logging modifications to persistent storage prior to disk updates." },
          { q: "What does a database connection pool manage in {topic}?", opts: ["A cache of reusable database connections", "A list of table indexes", "User authentication roles", "File system encryption keys"], ans: 0, exp: "Connection pooling reduces connection startup overhead by reusing a set of warm client sockets." },
          { q: "What is database replication in {topic}?", opts: ["Copying data from one server to another to ensure high availability", "Duplicating table columns", "Compiling query statements", "Formatting data tables"], ans: 0, exp: "Replication mirrors database state to secondary instances for backup and load balancing." },
          { q: "What is the purpose of database query optimization in {topic}?", opts: ["Analyzing SQL code to find the most efficient execution plan", "Changing database schema definitions", "Deleting old attempt logs", "Formatting code indentation"], ans: 0, exp: "Optimizers evaluate index paths and join orders to minimize disk inputs/outputs." },
          { q: "What does a Check constraint do in {topic}?", opts: ["Validates that column values satisfy a specific boolean condition", "Checks server health", "Indexes table columns", "Authenticates administrators"], ans: 0, exp: "CHECK constraints validate entries (e.g., age >= 18) before commits are allowed." },
          { q: "What is the key feature of a relational database in {topic}?", opts: ["Organizing data into tables with defined rows and columns", "Storing unstructured text files", "Using graph-based node traversals only", "Avoiding query syntax structures"], ans: 0, exp: "Relational models organize properties into structured columns and rows linked by key relations." },
          { q: "Which NoSQL category does Redis belong to in {topic} classifications?", opts: ["Document Store", "Graph Database", "Key-Value Store", "Wide-Column Store"], ans: 2, exp: "Redis is an in-memory key-value data structure store used as a database and cache." },
          { q: "What is a database transaction roll-back in {topic}?", opts: ["Aborting transaction operations and restoring the database to its previous state", "Re-executing query statements", "Deleting table constraints", "Backing up files to disk"], ans: 0, exp: "Rollbacks revert uncommitted operations if errors occur during a transaction block." }
        ];
      } else if (categoryName === 'DSA') {
        templates = [
          { q: "What is the average time complexity of searching in a balanced Binary Search Tree (BST) for {topic}?", opts: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], ans: 1, exp: "Balanced BSTs halve the search area at each node, taking logarithmic O(log N) lookup time." },
          { q: "Which data structure follows the Last-In-First-Out (LIFO) paradigm in {topic}?", opts: ["Queue", "Stack", "Linked List", "Graph"], ans: 1, exp: "A Stack pushes and pops items from the same end, executing in LIFO order." },
          { q: "What is the time complexity of pushing an element onto a Stack of size N in {topic}?", opts: ["O(1)", "O(log N)", "O(N)", "O(N²)"], ans: 0, exp: "Push operations insert elements at the top index directly, taking constant O(1) time." },
          { q: "Which sorting algorithm has a worst-case time complexity of O(N log N) in {topic}?", opts: ["Bubble Sort", "Quick Sort", "Merge Sort", "Insertion Sort"], ans: 2, exp: "Merge Sort consistently splits and merges arrays in O(N log N) time regardless of input state." },
          { q: "What is the worst-case space complexity of recursive Depth First Search (DFS) on a tree of height H in {topic}?", opts: ["O(1)", "O(log H)", "O(H)", "O(N)"], ans: 2, exp: "Recursive DFS uses call stacks proportional to the height of the active execution tree branch." },
          { q: "Which queue type allows insertion and deletion from both ends in {topic}?", opts: ["Simple Queue", "Circular Queue", "Double Ended Queue (Deque)", "Priority Queue"], ans: 2, exp: "Deques support push/pop operations on both front and rear indices." },
          { q: "What is the average lookup time complexity in a Hash Table for {topic}?", opts: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], ans: 0, exp: "With a uniform hash function, tables resolve lookups in constant O(1) time." },
          { q: "Which traversal of a BST yields elements in sorted ascending order for {topic}?", opts: ["Pre-order", "In-order", "Post-order", "Level-order"], ans: 1, exp: "In-order traversal visits left subtree, root, and right subtree, producing sorted output." },
          { q: "What is the time complexity of accessing an element in an Array by index for {topic}?", opts: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], ans: 0, exp: "Arrays store elements contiguously; index arithmetic allows constant time O(1) pointer lookup." },
          { q: "Which graph representation is optimal for sparse graphs in {topic}?", opts: ["Adjacency Matrix", "Adjacency List", "Incidence Matrix", "Linked Array List"], ans: 1, exp: "Adjacency lists store only existing edges, minimizing space complexity for sparse structures." },
          { q: "What is the key principle behind Dynamic Programming in {topic}?", opts: ["Solving subproblems once and caching results (memoization)", "Using random algorithms", "Recursive brute force without limits", "Linear stack allocations"], ans: 0, exp: "Dynamic Programming optimizes recursion by solving overlapping subproblems once and caching outcomes." },
          { q: "What is the worst-case time complexity of standard QuickSort in {topic}?", opts: ["O(N)", "O(N log N)", "O(N²)", "O(N³)"], ans: 2, exp: "QuickSort degrades to quadratic O(N²) time when pivot splits are highly unbalanced (e.g., sorted array with first element as pivot)." },
          { q: "Which data structure is most suitable for implementing Breadth First Search (BFS) in {topic}?", opts: ["Stack", "Queue", "Binary Tree", "Hash Map"], ans: 1, exp: "BFS processes nodes level-by-level, requiring FIFO queue ordering." },
          { q: "What is the time complexity of deleting a node from a singly linked list given its pointer in {topic}?", opts: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], ans: 0, exp: "If the node pointer is known, swapping value with next and deleting next takes constant O(1) time." },
          { q: "What is the space complexity of an in-place sorting algorithm in {topic}?", opts: ["O(1) auxiliary space", "O(N) space", "O(log N) space", "O(N²) space"], ans: 0, exp: "In-place algorithms reorganise elements within the original container, using constant extra memory." },
          { q: "Which data structure is typically used to implement recursion in compiler runtimes for {topic}?", opts: ["Queue", "Stack", "Graph", "Tree"], ans: 1, exp: "Runtimes push stack frames during nested calls and pop them on returns." },
          { q: "What is the time complexity of building a heap from an array of size N in {topic}?", opts: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], ans: 2, exp: "Using Floyd's heap construction method (bottom-up), building a heap takes linear O(N) time." },
          { q: "Which algorithm pattern does Binary Search belong to in {topic}?", opts: ["Greedy Pattern", "Dynamic Programming", "Divide and Conquer", "Backtracking"], ans: 2, exp: "Binary search repeatedly splits search arrays in half, conquering divided subproblems." },
          { q: "What is a circular linked list in {topic}?", opts: ["A linked list where the last node points back to the first node", "A list containing round items", "A multidimensional grid structure", "A list with no pointers"], ans: 0, exp: "Circular linked lists form loops by linking the tail node's next pointer to the head node." },
          { q: "What is the key benefit of a doubly linked list over singly linked list in {topic}?", opts: ["Bidirectional traversal support", "Less memory consumption", "Constant index lookup speed", "Automatic garbage collection"], ans: 0, exp: "Each node in a doubly linked list has both previous and next pointers, allowing navigation in both directions." },
          { q: "What is the worst-case lookup complexity in a Hash Table due to key collisions for {topic}?", opts: ["O(1)", "O(log N)", "O(N)", "O(N²)"], ans: 2, exp: "If all keys hash to the same bucket, lookup degrades to scanning a linear list of size N." },
          { q: "Which tree traversal visits the root node last in {topic}?", opts: ["Pre-order", "In-order", "Post-order", "Level-order"], ans: 2, exp: "Post-order traversal recursively visits left and right subtrees before printing the root node." },
          { q: "What is the time complexity of checking if a graph contains a cycle using Union-Find in {topic}?", opts: ["O(E log V)", "O(E α(V))", "O(V + E)", "O(V²)"], ans: 1, exp: "Union-Find with path compression operates in near-linear time using the inverse Ackermann function." },
          { q: "What is the main property of a Min-Heap tree in {topic}?", opts: ["The root node holds the smallest value in the tree", "The tree is always sorted ascending", "Left child is always smaller than right child", "It has no leaf nodes"], ans: 0, exp: "Min-Heaps guarantee that parent nodes store values less than or equal to their children, making the root the absolute minimum." },
          { q: "What does space complexity measure in {topic} algorithms?", opts: ["The amount of memory used relative to input size", "The size of source code files", "The CPU cycles needed", "The database storage size"], ans: 0, exp: "Space complexity models memory consumption scaling as input volume grows." },
          { q: "Which algorithm solves the single-source shortest path problem on graphs with negative weights for {topic}?", opts: ["Dijkstra's Algorithm", "Bellman-Ford Algorithm", "Kruskal's Algorithm", "Prim's Algorithm"], ans: 1, exp: "Bellman-Ford relaxes edges sequentially, identifying negative weight cycles which Dijkstra cannot handle." },
          { q: "What is the time complexity of merging two sorted arrays of size M and N in {topic}?", opts: ["O(M * N)", "O(M + N)", "O(log(M + N))", "O(1)"], ans: 1, exp: "Comparing front items and copying takes linear O(M + N) traversal time." },
          { q: "Which data structure is optimal to implement a priority queue for {topic}?", opts: ["Array", "Linked List", "Binary Heap", "Stack"], ans: 2, exp: "Binary Heaps allow both insert and extract-min/max operations in logarithmic O(log N) time." },
          { q: "What is the height of a balanced AVL tree with N nodes in {topic}?", opts: ["O(N)", "O(log N)", "O(N log N)", "O(N²)"], ans: 1, exp: "AVL trees self-balance, maintaining height strictly within logarithmic O(log N) limits." },
          { q: "Which technique resolves hash table collisions by storing collided elements in linked lists?", opts: ["Open Addressing", "Linear Probing", "Chaining", "Quadratic Probing"], ans: 2, exp: "Chaining allocates buckets as heads of linked lists, appending collided entries sequentially." }
        ];
      } else if (categoryName === 'Placement Preparation') {
        if (topicName === 'Verbal Ability') {
          templates = [
            { q: "Identify the error in the following sentence: 'The list of candidates were so long that we could not read all the names.'", opts: ["The list of", "candidates were", "so long that", "No error"], ans: 1, exp: "The subject of the sentence is the singular noun 'list', not the plural 'candidates'. Therefore, the verb should be the singular 'was'." },
            { q: "Identify the error: 'By the time the fire brigade arrived, the fire destroyed the entire building.'", opts: ["By the time", "fire brigade arrived", "the fire destroyed", "No error"], ans: 2, exp: "When two actions occurred in the past, the earlier action is expressed in the Past Perfect Tense (had destroyed) and the later action in the Simple Past Tense (arrived)." },
            { q: "Choose the correct alternative to improve the underlined part: 'If I was you, I would not have accepted that offer.'", opts: ["If I am you", "If I were you", "If I had been you", "No correction required"], ans: 1, exp: "This is a subjunctive conditional sentence (hypothetical), which requires the verb 'were' instead of 'was' regardless of the subject's singular form." },
            { q: "Fill in the blank: 'He was accused _______ stealing the jewelry from the shop.'", opts: ["for", "of", "with", "about"], ans: 1, exp: "The verb 'accused' is always followed by the preposition 'of'." },
            { q: "Find the synonym of the word: ABUNDANT", opts: ["Scarce", "Plentiful", "Rare", "Meager"], ans: 1, exp: "Abundant means existing or available in large quantities; overflowing. Plentiful has the same meaning." },
            { q: "Choose the word which is opposite in meaning to METICULOUS.", opts: ["Careful", "Scrupulous", "Careless", "Detailed"], ans: 2, exp: "Meticulous means showing great attention to detail; very careful and precise. Careless is the antonym." },
            { q: "What is the one-word substitution for: 'A person who is indifferent to pain or pleasure'?", opts: ["Stoic", "Epicure", "Altruist", "Sadist"], ans: 0, exp: "A stoic is a person who can endure pain or hardship without showing their feelings or complaining." },
            { q: "Select the pair that expresses a relationship similar to: 'Oculist : Eye'", opts: ["Dentist : Ear", "Cardiologist : Heart", "Pediatrician : Bones", "Neurologist : Teeth"], ans: 1, exp: "An oculist is a specialist who treats eye conditions; similarly, a cardiologist is a specialist who treats heart conditions." },
            { q: "Change the sentence to Passive Voice: 'The chef prepared a delicious meal for the guests.'", opts: ["A delicious meal was prepared by the chef for the guests.", "A delicious meal had been prepared by the chef for the guests.", "The guests were prepared a delicious meal by the chef.", "A delicious meal is prepared by the chef for the guests."], ans: 0, exp: "The simple past active verb 'prepared' changes to 'was/were prepared' in passive voice." },
            { q: "Convert to Indirect Speech: 'She said, \"I have finished my homework.\"'", opts: ["She said that she finished her homework.", "She said that she has finished her homework.", "She said that she had finished her homework.", "She says that she had finished her homework."], ans: 2, exp: "Present perfect tense (have finished) in direct speech changes to past perfect (had finished) in indirect speech when the reporting verb (said) is in the past tense." },
            { q: "What is the meaning of the idiom: 'To spill the beans'?", opts: ["To drop food accidently", "To reveal a secret prematurely", "To work hard on a farm", "To waste money"], ans: 1, exp: "'To spill the beans' is a common English idiom meaning to disclose secret information, especially unintentionally." },
            { q: "Choose the correct spelling from the options:", opts: ["Accomodation", "Accommodation", "Acomodation", "Accomodasion"], ans: 1, exp: "The correct spelling is 'Accommodation' with double 'c' and double 'm'." },
            { q: "The manager's _______ attitude made it difficult for team members to share their opinions freely.", opts: ["benevolent", "dictatorial", "flexible", "apathetic"], ans: 1, exp: "A 'dictatorial' (authoritarian or overbearing) attitude blocks free sharing of opinions." },
            { q: "Identify the error: 'Scarcely had he stepped out of the house when it started raining heavily.'", opts: ["Scarcely had he", "stepped out of the house", "when it started", "No error"], ans: 3, exp: "'Scarcely' is correctly paired with 'when'. There is no error." },
            { q: "Choose the opposite of EPHEMERAL.", opts: ["Transient", "Permanent", "Fleeting", "Short-lived"], ans: 1, exp: "Ephemeral means lasting for a very short time. Permanent is the opposite." },
            { q: "Choose the correct statement: 'Although solar energy is free and abundant, its initial setup cost remains high, preventing widespread adoption in developing nations.'", opts: ["Solar energy is expensive in the long run", "High initial setup cost restricts solar adoption in developing nations", "Solar energy is scarce in developing countries", "Developing nations have banned solar energy"], ans: 1, exp: "The statement directly mentions that the high initial setup cost prevents widespread adoption in developing nations." },
            { q: "What is the study of birds called?", opts: ["Entomology", "Ornithology", "Anthropology", "Zoology"], ans: 1, exp: "Ornithology is the scientific study of birds." },
            { q: "Correct the underlined part: 'Between you and I, I don't think he will win the race.'", opts: ["Between you and me", "Between I and you", "Between me and you", "No correction required"], ans: 0, exp: "'Between' is a preposition, and prepositions are followed by object pronouns (me), not subject pronouns (I)." },
            { q: "We have been waiting for the bus _______ 8:00 AM.", opts: ["for", "since", "from", "at"], ans: 1, exp: "'Since' is used to denote a specific point in time in the past when an action started." },
            { q: "Identify the error: 'Of the two options, this one is definitely the best.'", opts: ["Of the two", "options, this one", "is definitely the best", "No error"], ans: 2, exp: "When comparing two things, the comparative degree ('better') should be used instead of the superlative degree ('best')." },
            { q: "Choose the synonym of MITIGATE.", opts: ["Aggravate", "Alleviate", "Enhance", "Initiate"], ans: 1, exp: "Mitigate means to make less severe, serious, or painful. Alleviate is a synonym." },
            { q: "What does 'Burn the midnight oil' mean?", opts: ["To waste electricity", "To work or study late into the night", "To start a fire", "To cook late at night"], ans: 1, exp: "'Burn the midnight oil' means to read, study, or work late into the night." },
            { q: "Despite the team's best efforts, the project failed due to a lack of _______ support from the management.", opts: ["intermittent", "financial", "adverse", "hostile"], ans: 1, exp: "Lack of 'financial' support logically explains why a project failed despite the team's best efforts." },
            { q: "Change to Passive Voice: 'Close the door.'", opts: ["Let the door be closed.", "You must close the door.", "The door was closed.", "Let the door closed."], ans: 0, exp: "Imperative active commands ('Verb + Object') change to 'Let + Object + be + past participle' in passive voice." },
            { q: "What is a system of government by one person with absolute power called?", opts: ["Democracy", "Autocracy", "Oligarchy", "Anarchy"], ans: 1, exp: "Autocracy is a system of government by one person with absolute power." },
            { q: "Choose the matching pair: 'Watt : Power'", opts: ["Ampere : Voltage", "Joule : Energy", "Newton : Mass", "Ohm : Current"], ans: 1, exp: "Watt is the SI unit of power; Joule is the SI unit of energy." },
            { q: "Identify the error: 'The doctor advised him to take two spoonsful of medicine daily.'", opts: ["advised him", "to take two spoonsful", "of medicine daily", "No error"], ans: 1, exp: "The correct plural form is 'spoonfuls', not 'spoonsful'." },
            { q: "Find the antonym of OSTENTATIOUS.", opts: ["Showy", "Pretentious", "Humble", "Flashy"], ans: 2, exp: "Ostentatious means characterized by vulgar or pretentious display. Humble (or modest) is the antonym." },
            { q: "Fill in the blank: 'The keys were lying _______ the pile of books on the desk.'", opts: ["underneath", "between", "among", "along"], ans: 0, exp: "'Underneath' means situated directly below something." },
            { q: "She was so exhausted that she _______ down on the bed and fell asleep immediately.", opts: ["laid", "lay", "lied", "lain"], ans: 1, exp: "'Lay' is the past tense of 'lie' (to recline). 'Laid' is the past tense of 'lay' (to put or place something down), which requires an object." }
          ];
        } else if (topicName === 'Quantitative Aptitude') {
          templates = [
            { q: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", opts: ["120 meters", "150 meters", "324 meters", "180 meters"], ans: 1, exp: "Speed = 60 * 5/18 = 50/3 m/s. Length = Speed * Time = 50/3 * 9 = 150 meters." },
            { q: "If A and B can do a piece of work in 8 days, and A alone can do it in 12 days, in how many days can B alone do it?", opts: ["10 days", "16 days", "24 days", "20 days"], ans: 2, exp: "1/B = 1/8 - 1/12 = 1/24. Thus, B takes 24 days." },
            { q: "Find the compound interest on Rs. 10,000 for 2 years at 10% per annum, compounded annually.", opts: ["Rs. 2,000", "Rs. 2,100", "Rs. 1,000", "Rs. 2,200"], ans: 1, exp: "Amount = 10000 * (1.1)^2 = 12100. CI = 12100 - 10000 = 2100." },
            { q: "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. What is the sum?", opts: ["Rs. 650", "Rs. 690", "Rs. 698", "Rs. 700"], ans: 2, exp: "SI for 1 year = 854 - 815 = 39. SI for 3 years = 39 * 3 = 117. Principal = 815 - 117 = 698." },
            { q: "Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, the time taken to fill the tank is:", opts: ["50 mins", "12 mins", "25 mins", "15 mins"], ans: 1, exp: "Net part filled in 1 min = 1/20 + 1/30 = 5/60 = 1/12. So it takes 12 minutes." },
            { q: "A person crosses a 600 m long street in 5 minutes. What is his speed in km per hour?", opts: ["3.6 km/hr", "7.2 km/hr", "8.4 km/hr", "10 km/hr"], ans: 1, exp: "Speed = 600m / 300s = 2 m/s = 2 * 18/5 = 7.2 km/hr." },
            { q: "What is the probability of getting a sum of 9 from two throws of a dice?", opts: ["1/6", "1/8", "1/9", "1/12"], ans: 2, exp: "Favorable outcomes: (3,6), (4,5), (5,4), (6,3) = 4. Total outcomes = 36. Probability = 4/36 = 1/9." },
            { q: "A sum of Rs. 12,500 amounts to Rs. 15,500 in 4 years at the rate of simple interest. What is the rate of interest?", opts: ["3%", "4%", "5%", "6%"], ans: 3, exp: "SI = 15500 - 12500 = 3000. Rate = (3000 * 100) / (12500 * 4) = 6%." },
            { q: "A fruit seller had some apples. He sells 40% apples and still has 420 apples. Originally, he had:", opts: ["588 apples", "600 apples", "672 apples", "700 apples"], ans: 3, exp: "60% of total = 420. Total = 420 / 0.6 = 700." },
            { q: "The cost price of 20 articles is the same as the selling price of x articles. If the profit is 25%, then the value of x is:", opts: ["15", "16", "18", "25"], ans: 1, exp: "Profit% = (20 - x)/x * 100 = 25 => 20 - x = 0.25x => 1.25x = 20 => x = 16." },
            { q: "What is the average of first five multiples of 3?", opts: ["3", "9", "12", "15"], ans: 1, exp: "Multiples: 3, 6, 9, 12, 15. Sum = 45. Average = 45 / 5 = 9." },
            { q: "In a group of cows and chickens, the number of legs is 14 more than twice the number of heads. The number of cows is:", opts: ["5", "7", "10", "12"], ans: 1, exp: "Let cows = C, chickens = H. 4C + 2H = 2(C + H) + 14 => 4C + 2H = 2C + 2H + 14 => 2C = 14 => C = 7." },
            { q: "The ratio between the present ages of P and Q is 6:7. If Q is 4 years old than P, what will be the ratio of the ages of P and Q after 4 years?", opts: ["3:4", "7:8", "8:9", "None of these"], ans: 1, exp: "Let ages be 6x and 7x. 7x - 6x = 4 => x = 4. Ages are 24 and 28. After 4 years, ages are 28 and 32. Ratio = 28:32 = 7:8." },
            { q: "The compound interest on Rs. 30,000 at 7% per annum is Rs. 4,347. The period (in years) is:", opts: ["1", "2", "3", "4"], ans: 1, exp: "Amount = 30000 + 4347 = 34347. 30000*(1.07)^n = 34347 => (1.07)^n = 1.1449 => n = 2 years." },
            { q: "A, B and C start a business each investing Rs. 20,000. After 5 months A withdrew Rs. 5000, B withdrew Rs. 4000 and C invested Rs. 6000 more. At the end of the year, a total profit of Rs. 69,900 was recorded. Find share of A.", opts: ["Rs. 20,500", "Rs. 21,200", "Rs. 28,200", "Rs. 20,000"], ans: 0, exp: "A's ratio: 20000*5 + 15000*7 = 205000. B's ratio: 20000*5 + 16000*7 = 212000. C's ratio: 20000*5 + 26000*7 = 282000. Share of A = 205 / (205 + 212 + 282) * 69900 = 20500." },
            { q: "The H.C.F. of two numbers is 11 and their L.C.M. is 7700. If one of the numbers is 275, then the other is:", opts: ["279", "308", "318", "440"], ans: 1, exp: "Product of numbers = HCF * LCM. Other number = (11 * 7700) / 275 = 308." },
            { q: "A shopkeeper sells an article for Rs. 240, making a loss of 20%. To make a profit of 20%, what should be the selling price?", opts: ["Rs. 280", "Rs. 300", "Rs. 360", "Rs. 400"], ans: 2, exp: "80% of CP = 240 => CP = 300. 120% of CP = 300 * 1.2 = 360." },
            { q: "How many terms are there in the G.P. 3, 6, 12, 24, ..., 384?", opts: ["6", "7", "8", "9"], ans: 2, exp: "a = 3, r = 2. a*r^(n-1) = 384 => 3 * 2^(n-1) = 384 => 2^(n-1) = 128 => n-1 = 7 => n = 8." },
            { q: "In how many ways can the letters of the word 'LEADER' be arranged?", opts: ["720", "360", "120", "144"], ans: 1, exp: "Length = 6 letters with 'E' repeated twice. Arrangements = 6! / 2! = 720 / 2 = 360." },
            { q: "If log 2 = 0.30103, the number of digits in 2^64 is:", opts: ["18", "19", "20", "21"], ans: 2, exp: "log(2^64) = 64 * log 2 = 64 * 0.30103 = 19.265. Number of digits = 19 + 1 = 20." },
            { q: "Find the odd man out in the series: 3, 5, 7, 12, 17, 19.", opts: ["5", "12", "17", "19"], ans: 1, exp: "All numbers are prime except 12." },
            { q: "If log (x + y) = log x + log y, then:", opts: ["x = y", "x = y / (y-1)", "y = x / (x-1)", "x = y / (y+1)"], ans: 1, exp: "log(x + y) = log(xy) => x + y = xy => y = xy - x => y = x(y - 1) => x = y / (y-1)." },
            { q: "Three numbers are in ratio 1 : 2 : 3 and their H.C.F. is 12. The numbers are:", opts: ["12, 24, 36", "4, 8, 12", "5, 10, 15", "24, 48, 72"], ans: 0, exp: "Since HCF is 12, numbers must be 12*1, 12*2, 12*3 which is 12, 24, 36." },
            { q: "The simple interest on a certain sum of money for 2(1/2) years at 12% per annum is Rs. 40 less than the simple interest on the same sum for 3(1/2) years at 10% per annum. Find the sum.", opts: ["Rs. 600", "Rs. 800", "Rs. 1000", "Rs. 1200"], ans: 1, exp: "Interest 1 = P * 2.5 * 0.12 = 0.30P. Interest 2 = P * 3.5 * 0.10 = 0.35P. Difference = 0.05P = 40 => P = 800." },
            { q: "If A:B = 2:3, B:C = 4:5 and C:D = 6:7, then A:D is:", opts: ["16:35", "12:35", "8:15", "16:21"], ans: 0, exp: "A/D = A/B * B/C * C/D = 2/3 * 4/5 * 6/7 = 48 / 105 = 16/35." },
            { q: "Two numbers are 20% and 50% more than a third number respectively. The ratio of the two numbers is:", opts: ["2:5", "3:5", "4:5", "5:4"], ans: 2, exp: "Let third number = 100. Numbers are 120 and 150. Ratio = 120:150 = 4:5." },
            { q: "Find the single discount equivalent to a series discount of 20% and 10%.", opts: ["30%", "28%", "25%", "18%"], ans: 1, exp: "Net price = 100 * 0.8 * 0.9 = 72%. Discount = 100 - 72 = 28%." },
            { q: "A speed of 14 m/sec is the same as:", opts: ["28 km/hr", "46.8 km/hr", "50.4 km/hr", "70 km/hr"], ans: 2, exp: "Speed = 14 * 18/5 = 50.4 km/hr." },
            { q: "A card is drawn from a pack of 52 cards. The probability of getting a queen of club or a king of heart is:", opts: ["1/13", "2/13", "1/26", "1/52"], ans: 2, exp: "Favorable cards = 2 (Queen of clubs, King of hearts). Probability = 2/52 = 1/26." },
            { q: "In how many ways can a committee of 5 members be formed from 6 gentlemen and 4 ladies, if it contains at least 3 gentlemen?", opts: ["186", "200", "162", "120"], ans: 0, exp: "Cases: (3G, 2L) = 6C3 * 4C2 = 20 * 6 = 120. (4G, 1L) = 6C4 * 4C1 = 15 * 4 = 60. (5G) = 6C5 = 6. Total = 120 + 60 + 6 = 186." }
          ];
        } else if (topicName === 'Logical Reasoning') {
          templates = [
            { q: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?", opts: ["His nephew's", "His son's", "His father's", "His own"], ans: 1, exp: "'My father's son' is the man himself (since he has no siblings). So the photograph is of his son (that man's father is me)." },
            { q: "Choose the word which is least like the other words in the group.", opts: ["Copper", "Zinc", "Brass", "Aluminum"], ans: 2, exp: "Brass is an alloy, while copper, zinc, and aluminum are pure metals." },
            { q: "If in a certain language, CHAMPION is coded as HCMAIPNO, how is NEGATIVE coded in that code?", opts: ["ENAGITEV", "NEAGVEIT", "ENGAITVE", "ENGATIEV"], ans: 0, exp: "Letters are swapped in pairs: CH->HC, AM->MA, PI->IP, ON->NO. So NE->EN, GA->AG, TI->IT, VE->EV = ENAGITEV." },
            { q: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?", opts: ["1/3", "1/8", "2/8", "1/16"], ans: 1, exp: "Each number is half of the previous number. (1/4) * (1/2) = 1/8." },
            { q: "An informal gathering occurs when a group of people get together in a casual way. Which situation is the best example?", opts: ["A debate team rehearsing", "A neighborhood block party", "A corporate board meeting", "A university lecture class"], ans: 1, exp: "A neighborhood block party is casual and unstructured, representing an informal gathering." },
            { q: "One morning after sunrise, Suresh was standing facing a pole. The shadow of the pole fell exactly to his right. Which direction was he facing?", opts: ["East", "West", "North", "South"], ans: 3, exp: "In the morning, the sun rises in the East, so shadows fall towards the West. Since the shadow was to Suresh's right, Suresh must be facing South (so that his right side is West)." },
            { q: "Syllogism: Statements: (1) All mangoes are golden. (2) No golden things are cheap. Conclusions: (I) All mangoes are cheap. (II) Golden mangoes are not cheap.", opts: ["Only conclusion I follows", "Only conclusion II follows", "Either I or II follows", "Neither I nor II follows"], ans: 1, exp: "Since all mangoes are golden, and no golden things are cheap, no mangoes can be cheap. Hence conclusion II is correct." },
            { q: "Find the missing number in the series: 7, 10, 8, 11, 9, 12, ...", opts: ["7", "10", "12", "13"], ans: 1, exp: "Alternate series: +3, -2, +3, -2. So 12 - 2 = 10." },
            { q: "If A + B means A is the brother of B; A - B means A is the sister of B; A * B means A is the father of B. Which of the following means C is the son of M?", opts: ["M - N * C + F", "F - C + N * M", "N + M - F * C", "M * C - N"], ans: 3, exp: "M * C - N implies M is the father of C and C is the sister/brother of N, representing C is the son of M." },
            { q: "Which word does NOT belong with the others?", opts: ["parsley", "basil", "dill", "mayonnaise"], ans: 3, exp: "Mayonnaise is a condiment, whereas parsley, basil, and dill are herbs." },
            { q: "If 'pen' is 'paper', 'paper' is 'yellow', 'yellow' is 'sky', 'sky' is 'ink', and 'ink' is 'red', what do we write with?", opts: ["pen", "paper", "yellow", "ink"], ans: 1, exp: "We write with a 'pen'. According to the code, 'pen' is called 'paper'." },
            { q: "Find the odd one out: 361, 441, 529, 576.", opts: ["361", "441", "529", "576"], ans: 3, exp: "361 (19^2), 441 (21^2), and 529 (23^2) are squares of odd numbers. 576 (24^2) is the square of an even number." },
            { q: "Find the missing letters in the series: SCD, TEF, UGH, ____, WKL.", opts: ["VIJ", "VJH", "IJT", "UJI"], ans: 0, exp: "First letters: S, T, U, V, W. Second letters: C, E, G, I, K. Third letters: D, F, H, J, L. So it is VIJ." },
            { q: "A man walks 5 km towards South, then turns right and walks 3 km. He turns left and walks 4 km. Finally he turns back and walks 9 km. In which direction is he now from the starting point?", opts: ["West", "South", "East", "North"], ans: 0, exp: "Start at (0,0). Walks 5 South -> (0, -5). Turns right (West) and walks 3 -> (-3, -5). Turns left (South) and walks 4 -> (-3, -9). Turns back (North) and walks 9 -> (-3, 0). From (0,0), (-3,0) is directly West." },
            { q: "Statements: Some keys are staplers. Some staplers are calculators. Conclusions: (I) Some keys are calculators. (II) No key is a calculator.", opts: ["Only conclusion I follows", "Only conclusion II follows", "Either I or II follows", "Neither follows"], ans: 2, exp: "Either some keys are calculators or no key is a calculator must be true (complementary pair)." },
            { q: "If 1st January 2007 was a Monday, what day of the week was 1st January 2008?", opts: ["Monday", "Tuesday", "Wednesday", "Thursday"], ans: 1, exp: "2007 is a non-leap year (has 365 days = 52 weeks + 1 day). So 1st Jan 2008 is Monday + 1 day = Tuesday." },
            { q: "In a row of 30 children, A is 11th from the right. What is his position from the left?", opts: ["19th", "20th", "21st", "22nd"], ans: 1, exp: "Left Position = Total - Right Position + 1 = 30 - 11 + 1 = 20th." },
            { q: "Choose the word which is least like the other words in the group.", opts: ["Geometry", "Algebra", "Calculus", "Thermodynamics"], ans: 3, exp: "Thermodynamics is a branch of physics, while the others are branches of mathematics." },
            { q: "A, B, C, D and E are sitting on a bench. A is next to B, C is next to D, D is not sitting with E who is on the left end of the bench. C is on the second position from the right. A is to the right of B and E. A and C are sitting together. In which position is A sitting?", opts: ["Between B and D", "Between B and C", "Between E and D", "Between C and E"], ans: 1, exp: "Arrangement: E - B - A - C - D. A is between B and C." },
            { q: "Find the odd number in the series: 8, 27, 64, 100, 125, 216.", opts: ["8", "64", "100", "125"], ans: 2, exp: "All numbers are perfect cubes except 100 (which is 10^2)." },
            { q: "If A is the son of Q, Q and Y are sisters, Z is the mother of Y, P is the son of Z, then which of the following statements is correct?", opts: ["P and Y are sisters", "A is cousin of P", "P is the maternal uncle of A", "None of these"], ans: 2, exp: "Q and Y are sisters, Z is their mother. P is Z's son (brother of Q & Y). Since Q is mother of A, P is maternal uncle of A." },
            { q: "Which number replaces the question mark in: 4, 9, 20, 43, 90, ?", opts: ["180", "183", "185", "187"], ans: 2, exp: "Pattern: *2 + 1, *2 + 2, *2 + 3, *2 + 4. So 90 * 2 + 5 = 185." },
            { q: "What is the angle between the hour hand and the minute hand of a clock when the time is 3:25?", opts: ["47.5 degrees", "50 degrees", "42.5 degrees", "37.5 degrees"], ans: 0, exp: "Angle = |30H - 5.5M| = |30*3 - 5.5*25| = |90 - 137.5| = 47.5 degrees." },
            { q: "If 'System' is coded as '131035' and 'Keyboard' is coded as '24185637', how is 'Database' coded?", opts: ["76361674", "76361675", "76361678", "None"], ans: 3, exp: "Codes match letter indexes or custom cipher rules. Database can be derived from existing letter mappings." },
            { q: "Syllogism: Statements: (1) Some actors are singers. (2) All singers are dancers. Conclusions: (I) Some actors are dancers. (II) No singer is an actor.", opts: ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"], ans: 0, exp: "Since some actors are singers and all singers are dancers, those actor-singers are definitely dancers. So I follows. II is incorrect since some actors are singers." },
            { q: "If X is the brother of the son of Y's son, how is X related to Y?", opts: ["Son", "Brother", "Grandson", "Cousin"], ans: 2, exp: "Y's son's son is Y's grandson. Y's grandson's brother is also Y's grandson." },
            { q: "If the day before yesterday was Thursday, what day will be the day after tomorrow?", opts: ["Monday", "Tuesday", "Wednesday", "Sunday"], ans: 0, exp: "Day before yesterday = Thursday => Yesterday = Friday => Today = Saturday => Tomorrow = Sunday => Day after tomorrow = Monday." },
            { q: "Which word represents: 'An instrument used to measure atmospheric pressure'?", opts: ["Thermometer", "Barometer", "Anemometer", "Hygrometer"], ans: 1, exp: "A barometer measures atmospheric pressure." },
            { q: "Odd one out: Square, Circle, Triangle, Rectangle.", opts: ["Square", "Circle", "Triangle", "Rectangle"], ans: 1, exp: "Circle has a curved boundary, while all others are polygons made of straight line segments." },
            { q: "Complete the analog pair: 'Lighthouse : Ship :: Traffic Light : ?'", opts: ["Road", "Car", "Pedestrian", "Driver"], ans: 1, exp: "A lighthouse guides ships; a traffic light directs cars/vehicles." }
          ];
        } else {
          // Placement Preps General Fallback (HR/Technical Interview / Aptitudes)
          templates = [
            { q: "Which of the following is considered a strength in a professional HR Interview?", opts: ["Discussing weaknesses with an improvement strategy", "Speaking negatively about previous employers", "Showing rigid salary expectations early", "Pretending to have no weaknesses"], ans: 0, exp: "A good answer shows self-awareness and active steps to improve." },
            { q: "In a Technical Interview, what does the STAR method stand for?", opts: ["Situation, Task, Action, Result", "System, Test, Analyze, Report", "Structured, Timed, Active, Rigorous", "Strategy, Theory, Application, Review"], ans: 0, exp: "STAR is a structured manner of responding to behavioral questions." },
            { q: "What should you do if you do not know the answer to a question in a Technical Interview?", opts: ["Admit it honestly and explain your line of thought", "Make up a plausible-sounding guess", "Remain completely silent", "Ask the interviewer to change the topic"], ans: 0, exp: "Honesty and demonstrating problem-solving ability are highly valued by interviewers." },
            { q: "What is the best way to answer: 'Why should we hire you?'", opts: ["Aligning your skills with the company's needs and showing enthusiasm", "Explaining that you need a job desperately", "Boasting that you are the smartest candidate", "None of the above"], ans: 0, exp: "Focus on how you add value to the role and team." },
            { q: "Which of the following is an example of a good HR interview question to ask the interviewer?", opts: ["'What does a typical day look like in this role?'", "'How long is the lunch break?'", "'Do you monitor employee search histories?'", "'How much raise do I get next year?'"], ans: 0, exp: "Questions about the role show genuine interest and work ethic." },
            { q: "What is the primary purpose of an HR behavioral interview?", opts: ["To predict future performance based on past work behaviors", "To test raw coding speeds", "To check memory of historical facts", "To verify degree certificates"], ans: 0, exp: "Behavioral questions look at soft skills, cooperation, and conflict resolution." },
            { q: "In a coding aptitude round, what does Dry Running code mean?", opts: ["Tracing the code path manually on paper with sample inputs", "Compiling the code with optimized compiler flags", "Checking the code against network sockets", "None of these"], ans: 0, exp: "Dry running means running the step-by-step logic manually to check correctness." },
            { q: "What is a common question asked in HR rounds to evaluate cultural fit?", opts: ["'How do you handle working in a diverse team?'", "'What is the time complexity of bubble sort?'", "'Which SQL clause filters groups?'", "'How many bytes are in a double word?'"], ans: 0, exp: "Questions about teamwork evaluate cooperation and cultural fit." },
            { q: "In a Technical Interview, how should you discuss your past projects?", opts: ["Detailing your specific contributions, challenges faced, and the impact", "Describing only the team's achievements generically", "Skipping the technical stack description", "Saying the project was simple and unimportant"], ans: 0, exp: "Focusing on your contribution, problem-solving, and outcomes shows ownership." },
            { q: "Which of the following describes a conflict-resolution model in HR interviews?", opts: ["Empathizing with the coworker, discussing privately, and finding a compromise", "Reporting immediately to the CEO", "Ignoring the issue completely", "Arguing in public to prove you are right"], ans: 0, exp: "Private professional resolution shows emotional intelligence and leadership." },
            { q: "What does active listening in an interview involve?", opts: ["Nodding, maintaining eye contact, and responding relevantly", "Interrupting the interviewer to show you know the answer", "Writing down every word on a notepad", "None of the above"], ans: 0, exp: "Active listening shows respect and correct comprehension of instructions." },
            { q: "What should you research about a company before attending the interview?", opts: ["The company's core products, vision, recent news, and culture", "The personal details of the HR manager", "The office building's blueprints", "The lunch menu of the canteen"], ans: 0, exp: "Understanding products and culture helps tailor your answers to align with the company." },
            { q: "How should you answer the question: 'Where do you see yourself in 5 years?'", opts: ["Showing a desire to grow into a skilled contributor/leader within the company", "Saying you want to start your own startup in 6 months", "Saying you don't know and don't care", "Saying you want to replace the interviewer"], ans: 0, exp: "A good answer shows long-term commitment and professional goal alignment." },
            { q: "What is the best way to explain a gap in your resume?", opts: ["Explaining the gap honestly, highlighting skills gained or personal growth during it", "Fabricating fake job experiences to fill it", "Blaming the job market or universities", "Refusing to talk about it"], ans: 0, exp: "Honesty and showing how you kept busy or grew professionally are key." },
            { q: "Which of the following is a key soft skill tested during group discussions?", opts: ["Collaborating, listening, and structured presentation of ideas", "Speaking continuously without letting others speak", "Aggressively shouting to prove your points", "Staying silent throughout"], ans: 0, exp: "Structured presentation and respect for others' viewpoints are key attributes evaluated in GDs." },
            { q: "What does 'Technical Aptitude' evaluate?", opts: ["Core computer science fundamentals, OS, networking, and programming logic", "Speed of typing on a keyboard", "General current affairs knowledge", "Memory of dictionary words"], ans: 0, exp: "Technical aptitude tests core CS foundation and engineering logic." },
            { q: "In coding aptitude, what does space complexity of O(1) mean?", opts: ["The algorithm uses constant extra memory space regardless of inputs", "The algorithm uses a single database table", "The algorithm executes in 1 millisecond", "The code has only 1 variable"], ans: 0, exp: "O(1) auxiliary space means auxiliary memory does not scale with input size." },
            { q: "Why do companies conduct technical aptitude tests?", opts: ["To filter out candidates based on problem-solving speed and core CS knowledge", "To test speaking accents", "To check writing hand speed", "None of the above"], ans: 0, exp: "Aptitude tests act as an efficient filter for core cognitive and CS foundations." },
            { q: "Which of the following is a best practice for resume formatting?", opts: ["Keeping it clean, bulleted, single-page (or two), highlighting impact and tech stacks", "Using 5 different bright neon colors", "Writing 10 pages detailing every minor task", "Avoiding mentioning project names"], ans: 0, exp: "A clean, impact-oriented resume helps interviewers scan your profile quickly." },
            { q: "In an HR interview, what is the best response to a stressful hypothetical situation?", opts: ["Stay calm, outline a logical step-by-step response plan, and seek help if needed", "Get angry or flustered immediately", "Refuse to answer the question", "Say that you would quit the job"], ans: 0, exp: "Remaining calm and systematic shows resilience and correct crisis management." },
            { q: "What is the purpose of mock interviews in pre-placement prep?", opts: ["To practice delivery, reduce anxiety, and get feedback on answers", "To bypass the actual interview selection", "To memorize exact answers for the real interview", "To grade candidates"], ans: 0, exp: "Practice boosts confidence and feedback shows areas of improvement." },
            { q: "What does a coding compiler syntax error indicate in coding tests?", opts: ["The code violates language syntax rules and cannot be compiled", "The database connection failed", "The algorithm runs too slow", "The code was run in a virtual environment"], ans: 0, exp: "Syntax errors are grammar violations of the coding language." },
            { q: "In a logical deduction question: 'All books are pages. Some pages are pictures.' Which is correct?", opts: ["No book is a picture", "Some books may be pictures", "All pictures are books", "None of these"], ans: 1, exp: "Since books are pages, and some pages are pictures, a book could overlap with pictures, so some books may be pictures." },
            { q: "What should you wear to a virtual placement interview?", opts: ["Formal professional attire", "Casual pajamas and t-shirts", "Bright party wear", "None of these"], ans: 0, exp: "Formals show professionalism, even in virtual remote setups." },
            { q: "What is the significance of the 'Impact' section in resume bullet points?", opts: ["It demonstrates the tangible value (percentages, values) your work generated", "It lists the computer hardware you used", "It details the salary you want", "It describes your hobby list"], ans: 0, exp: "Quantifiable impact (e.g., 'reduced load time by 30%') shows the business value of your work." },
            { q: "In an aptitude test, how should you allocate your time?", opts: ["Skip stuck questions and secure easy marks first", "Spend 15 minutes on a single hard question", "Solve all questions sequentially without looking at the timer", "Guess randomly on every question within 5 minutes"], ans: 0, exp: "Time management is crucial: target easy/medium questions first and leave hard ones for later." },
            { q: "What does 'verbal classification' mean in logical reasoning?", opts: ["Grouping items based on common characteristics and finding the odd one out", "Translating words to another language", "Correcting grammar errors", "Writing summaries"], ans: 0, exp: "Classification identifies similarities among group members to select the odd one." },
            { q: "What is the role of an email writing round in placement tests?", opts: ["To check business communication, formatting, and clarity of expression", "To test typing speed only", "To see if you know recipient emails", "To verify your personal email account"], ans: 0, exp: "Corporate communication checks evaluate correct grammar, tone, and logical formatting." },
            { q: "Why is 'Subject-Verb Agreement' highly tested in placement verbal sections?", opts: ["It is the foundational rule of English sentence structures", "It helps parse database SQL queries", "It compiles HTML tags", "It is only used in literature"], ans: 0, exp: "Subject-verb agreement is the key indicator of basic grammar proficiency." },
            { q: "What is the best way to handle negative marking in placement tests?", opts: ["Avoid guessing unless you can eliminate at least two options", "Guess randomly on all questions", "Leave all questions unattempted", "Guess option 'B' for everything"], ans: 0, exp: "Eliminating incorrect choices dramatically raises success probability, making educated guesses viable." }
          ];
        }
      } else {
        // Software, Programming, AI, CS, Placement, Advanced Tech fallback template
        templates = [
          { q: "What is the primary benefit of modular structure in {topic}?", opts: ["It isolates concerns and supports reusability", "It increases runtime execution latency", "It forces global scope allocations", "It deletes backup packages"], ans: 0, exp: "Modular design simplifies code structure and allows code segments to be imported across modules." },
          { q: "In {topic}, which of these describes encapsulation?", opts: ["Restricting direct access to object states and exposing clean APIs", "Writing all code in a single procedural block", "Sharing all memory blocks globally", "Minifying source files"], ans: 0, exp: "Encapsulation hides internal implementation, exposing only clean method wrappers." },
          { q: "Which of the following represents a best practice when writing {topic} code?", opts: ["Writing unit tests and document structures", "Hardcoding file paths", "Avoiding structured error handlers", "Using short, cryptic variable names"], ans: 0, exp: "Testing and clean docstrings guarantee long-term maintenance and regressions safety." },
          { q: "What is the purpose of structured exception handling in {topic}?", opts: ["To catch runtime exceptions and prevent application crashes", "To speed up compile timing", "To delete local variables", "To format output logs"], ans: 0, exp: "Structured exceptions (try-catch/except) let runtimes handle errors gracefully without hard termination." },
          { q: "How is concurrent scalability typically implemented in {topic}?", opts: ["Through asynchronous threads or event polling workers", "It does not support concurrent execution", "By reducing system CPU frequency", "By writing to text logs only"], ans: 0, exp: "Concurrency runtimes manage parallel threads or non-blocking event loops to process multi-client requests." },
          { q: "What is the role of metadata configurations in {topic} deployments?", opts: ["To outline project dependencies and compiler specifications", "To encrypt source code archives", "To increase compiled bundle size", "They are not supported in {topic}"], ans: 0, exp: "Metadata files coordinate build processes, dependencies, and deployment configurations." },
          { q: "Why is static analysis crucial in {topic} development pipelines?", opts: ["It catches formatting errors and type bugs before runtime", "It compiles code directly to assembly", "It increases runtime execution speed", "It replaces automated testing"], ans: 0, exp: "Static analyzers scan code without executing it, highlighting bugs and syntax warnings." },
          { q: "What does compiling or packing {topic} source code produce?", opts: ["Optimized executable targets or platform bytecode bundles", "Raw text script backups only", "Network protocol registers", "Nothing, it runs directly"], ans: 0, exp: "Packagers parse raw source, generating optimized target bundles suitable for servers or clients." },
          { q: "How are memory and garbage collection handled in modern {topic} platforms?", opts: ["Automatically managed via reference tracing or block scoping", "It requires manual assembly commands", "It does not use memory allocations", "By saving state data to files"], ans: 0, exp: "Runtimes trace references, freeing unreferenced memory blocks automatically." },
          { q: "Which architectural pattern is commonly used to separate client logic from backend data in {topic}?", opts: ["Model-View-Controller (MVC) or REST APIs", "Linear script queues", "Raw binary serial streams", "Direct hardware instructions"], ans: 0, exp: "MVC and REST decouple visual layers from data storage, simplifying updates." },
          { q: "What is the purpose of linting tools in the {topic} dev cycle?", opts: ["To validate code styling rules and find code smells", "To accelerate program execution speed", "To encrypt build outputs", "To host local databases"], ans: 0, exp: "Linters highlight formatting inconsistencies and potential code defects prior to code reviews." },
          { q: "What does the Single Responsibility Principle state in {topic} design?", opts: ["A module or class should have only one reason to change", "A file should contain only one line of code", "Only one user can connect at a time", "A variable can only hold integer values"], ans: 0, exp: "Single responsibility prevents class bloating, making components easy to mock and test." },
          { q: "What is the benefit of virtual environments in {topic} setup?", opts: ["Isolating package dependencies from global systems", "Overclocking local CPU speeds", "Hosting web applications", "Encrypting database directories"], ans: 0, exp: "Virtual envs ensure that projects run with their specific library versions without system pollution." },
          { q: "What does the compile phase lexical analysis do in {topic} compilers?", opts: ["Converts character sequences into a stream of structured tokens", "Optimizes query search syntax", "Saves execution history to files", "Configures database drivers"], ans: 0, exp: "Lexical analyzers group characters into meaningful tokens (keywords, operators) for parsing." },
          { q: "Which tool is commonly used to coordinate team source control in {topic}?", opts: ["Git & GitHub", "Text editors", "Package compilers", "Web browsers"], ans: 0, exp: "Git manages code version histories, merging collaborative updates from developers." },
          { q: "What is the purpose of API documentation in {topic} systems?", opts: ["To detail request parameters, responses, and integration methods", "To encrypt network traffic", "To compile database schema files", "To configure user passwords"], ans: 0, exp: "API docs (like Swagger) explain how clients integrate with server endpoints." },
          { q: "What does synchronous execution imply in {topic} context?", opts: ["Tasks are executed sequentially, blocking subsequent steps", "Tasks run concurrently in background threads", "Variables are encrypted on write", "Code runs only in development modes"], ans: 0, exp: "Synchronous blocking halts execution until the active operation completes." },
          { q: "What is a REST API standard response format commonly used in {topic}?", opts: ["JSON (JavaScript Object Notation)", "Raw CSV text files", "Compiled binary images", "Direct hardware assembly instructions"], ans: 0, exp: "JSON is the standard lightweight, human-readable data exchange format for web interfaces." },
          { q: "What is the main benefit of automated testing in {topic}?", opts: ["Ensuring regression safety and validating component logic", "Replacing developer documentation", "Obfuscating source code binaries", "Compressing project folder size"], ans: 0, exp: "Automated tests quickly check that changes do not break existing behaviors." },
          { q: "Which component is responsible for translating domain names to IP addresses for {topic} clients?", opts: ["DNS (Domain Name System)", "HTTP Server Routing", "Database Connection Pool", "Local Package Manager"], ans: 0, exp: "DNS acts as the address book of the internet, mapping hostnames to network IPs." },
          { q: "What is the key objective of the DRY (Don't Repeat Yourself) principle in {topic}?", opts: ["Reducing duplicate code by abstracting common logic", "Avoiding writing documentation comments", "Minimizing database indexing tasks", "Limiting the number of project functions"], ans: 0, exp: "DRY prevents code duplication, making future updates centralized and clean." },
          { q: "What is the purpose of software configuration variables in {topic}?", opts: ["To decouple environment settings from source code files", "To compile program logic faster", "To encrypt user password values", "To create table database index schemas"], ans: 0, exp: "Config variables (like .env) set runtime constants dynamically depending on staging/production environments." },
          { q: "Which mechanism allows objects in {topic} OOP systems to inherit properties from other classes?", opts: ["Class Inheritance", "Scope closures", "Variables scoping", "Structured error catch lists"], ans: 0, exp: "Inheritance allows child classes to reuse code and behaviors defined in parent classes." },
          { q: "What does continuous integration (CI) do in {topic} dev pipelines?", opts: ["Automatically builds, compiles, and tests code upon repository commit", "Manually deploys files to staging servers", "Configures database tables", "Deletes old git commit history logs"], ans: 0, exp: "CI automates build checks to detect code integration bugs early." },
          { q: "What is the purpose of database object-relational mapping (ORM) in {topic}?", opts: ["To query databases using native programming language object structures", "To host local web servers", "To validate web client cookies", "To encrypt network socket traffic"], ans: 0, exp: "ORMs (like Mongoose or Sequelize) translate database records to native objects, simplifying queries." },
          { q: "What is the function of an API gateway in {topic} network structures?", opts: ["Routs client requests, checks authentication, and manages traffic", "Saves document files to tape storage", "Compiles frontend bundle code", "Authenticates database administrator users"], ans: 0, exp: "Gateways act as the single entry point, routing requests to appropriate backend services." },
          { q: "What does the term 'Type Safety' guarantee in {topic} execution?", opts: ["Preventing variable operations that violate declared type constraints", "Encrypting text password fields", "Isolating server hardware sockets", "Structuring database tables"], ans: 0, exp: "Type safety prevents runtime type mismatch errors, catching errors at compile time." },
          { q: "Which protocol is the standard communication foundation for {topic} web services?", opts: ["HTTP / HTTPS", "SMTP / IMAP", "FTP / SFTP", "None of the above"], ans: 0, exp: "Hypertext Transfer Protocol coordinates document requests and API calls across the web." },
          { q: "What does software containerization (e.g., Docker) provide for {topic}?", opts: ["A consistent execution environment isolated from host configurations", "Faster CPU processing clock speeds", "Automatic query index generation", "Local file backup scopes"], ans: 0, exp: "Containers package applications with dependencies, guaranteeing consistent runtime across machines." },
          { q: "What is the primary role of a project compiler in {topic}?", opts: ["Converting human-readable source code into machine or target bytecode", "Validating client browser sessions", "Checking database table sizes", "Generating documentation reports"], ans: 0, exp: "Compilers translate programming structures into binary or virtual instruction codes." }
        ];
      }

      return templates.map(t => ({
        questionText: t.q.replace(/{topic}/g, topicName),
        options: t.opts.map(o => o.replace(/{topic}/g, topicName)),
        correctAnswer: t.ans,
        explanation: t.exp.replace(/{topic}/g, topicName)
      }));
    };

    const quizzesData = [];
    const difficulties = ["Easy", "Medium", "Hard"];
    let diffCounter = 0;

    categoryConfig.forEach(cfg => {
      cfg.quizzes.forEach((quizTitle, idx) => {
        const difficulty = difficulties[diffCounter % 3];
        diffCounter++;
        quizzesData.push({
          title: quizTitle,
          description: `Test your concepts and verify knowledge in ${quizTitle}. Features 30 multiple-choice questions.`,
          category: cfg.category,
          difficulty,
          duration: 30, // 30 minutes duration
          passingScore: 60,
          averageRating: parseFloat((4.2 + (idx % 8) * 0.1).toFixed(1)),
          attemptCount: 120 + (idx * 15),
          published: true,
          questions: generateQuestionsForTopic(quizTitle, cfg.category)
        });
      });
    });

    const createdQuizzes = await Quiz.insertMany(quizzesData);

    console.log('Seeding Sample Quiz Attempts for Analytics & Leaderboard...');
    const sampleAttempts = [
      {
        user: john._id,
        quiz: createdQuizzes[0]._id,
        quizTitle: createdQuizzes[0].title,
        category: createdQuizzes[0].category,
        score: 30,
        totalQuestions: 30,
        percentage: 100,
        correctAnswers: 30,
        wrongAnswers: 0,
        unanswered: 0,
        timeTaken: 240,
        status: 'Pass',
        createdAt: new Date(Date.now() - 86400000 * 3)
      },
      {
        user: john._id,
        quiz: createdQuizzes[1]._id,
        quizTitle: createdQuizzes[1].title,
        category: createdQuizzes[1].category,
        score: 24,
        totalQuestions: 30,
        percentage: 80,
        correctAnswers: 24,
        wrongAnswers: 6,
        unanswered: 0,
        timeTaken: 180,
        status: 'Pass',
        createdAt: new Date(Date.now() - 86400000 * 2)
      },
      {
        user: sarah._id,
        quiz: createdQuizzes[3]._id,
        quizTitle: createdQuizzes[3].title,
        category: createdQuizzes[3].category,
        score: 30,
        totalQuestions: 30,
        percentage: 100,
        correctAnswers: 30,
        wrongAnswers: 0,
        unanswered: 0,
        timeTaken: 320,
        status: 'Pass',
        createdAt: new Date(Date.now() - 86400000 * 4)
      },
      {
        user: sarah._id,
        quiz: createdQuizzes[6]._id,
        quizTitle: createdQuizzes[6].title,
        category: createdQuizzes[6].category,
        score: 24,
        totalQuestions: 30,
        percentage: 80,
        correctAnswers: 24,
        wrongAnswers: 6,
        unanswered: 0,
        timeTaken: 290,
        status: 'Pass',
        createdAt: new Date(Date.now() - 86400000 * 1)
      },
      {
        user: mike._id,
        quiz: createdQuizzes[7]._id,
        quizTitle: createdQuizzes[7].title,
        category: createdQuizzes[7].category,
        score: 30,
        totalQuestions: 30,
        percentage: 100,
        correctAnswers: 30,
        wrongAnswers: 0,
        unanswered: 0,
        timeTaken: 210,
        status: 'Pass',
        createdAt: new Date(Date.now() - 86400000 * 5)
      },
      {
        user: emily._id,
        quiz: createdQuizzes[5]._id,
        quizTitle: createdQuizzes[5].title,
        category: createdQuizzes[5].category,
        score: 24,
        totalQuestions: 30,
        percentage: 80,
        correctAnswers: 24,
        wrongAnswers: 6,
        unanswered: 0,
        timeTaken: 150,
        status: 'Pass',
        createdAt: new Date(Date.now() - 86400000 * 2)
      }
    ];

    await Attempt.insertMany(sampleAttempts);

    // Update user stats
    john.totalQuizzesAttempted = 2;
    john.totalScore = 54;
    john.bestScorePercentage = 100;
    john.badges = [
      { id: 'first_step', name: 'First Steps 🚀', description: 'Completed your very first quiz!', icon: 'Rocket' },
      { id: 'perfect_score', name: 'Perfect Score 🎯', description: 'Scored 100% on a quiz!', icon: 'Target' }
    ];
    await john.save();

    sarah.totalQuizzesAttempted = 2;
    sarah.totalScore = 54;
    sarah.bestScorePercentage = 100;
    sarah.badges = [
      { id: 'first_step', name: 'First Steps 🚀', description: 'Completed your very first quiz!', icon: 'Rocket' },
      { id: 'perfect_score', name: 'Perfect Score 🎯', description: 'Scored 100% on a quiz!', icon: 'Target' }
    ];
    await sarah.save();

    mike.totalQuizzesAttempted = 1;
    mike.totalScore = 30;
    mike.bestScorePercentage = 100;
    mike.badges = [
      { id: 'first_step', name: 'First Steps 🚀', description: 'Completed your very first quiz!', icon: 'Rocket' }
    ];
    await mike.save();

    emily.totalQuizzesAttempted = 1;
    emily.totalScore = 24;
    emily.bestScorePercentage = 80;
    emily.badges = [
      { id: 'first_step', name: 'First Steps 🚀', description: 'Completed your very first quiz!', icon: 'Rocket' }
    ];
    await emily.save();

    console.log('Database Seeding Completed Successfully! 🎉');
    if (process.argv[2] === 'exit') {
      process.exit(0);
    }
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    if (process.argv[2] === 'exit') {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
