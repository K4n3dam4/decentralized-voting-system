// voter struct
struct Voter {
    bool registered;
    bool voted;
    uint candidate;
    uint weight;
    address id;
}
// candidate struct
struct Candidate {
    string name;
    uint voteCount;
}
// result struct
struct Result {
    string name;
    uint voteCount;
}