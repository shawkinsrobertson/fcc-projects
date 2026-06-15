
const poll = new Map();

const addOption = option => {
  if(!option) {
    return `Option cannot be empty.`;
  };
  
  if(!poll.has(option)) {
    poll.set(option, new Set());
    return `Option "${option}" added to the poll.`;
  } else {
    return `Option "${option}" already exists.`
  };
};

function vote(option, voterId) {
  let checkId = poll.get(option);
  if(!poll.has(option)) {
    return `Option "${option}" does not exist.`;
  } else if(checkId.has(voterId)) {
    return `Voter ${voterId} has already voted for "${option}".`
  } else {
    checkId.add(voterId);
    return `Voter ${voterId} voted for "${option}".`
  }
}


function displayResults() {
  let pollResults = "Poll Results:";
  const newLine = "\n";
  poll.forEach((value, key) => {
    let voteNo = poll.get(key).size;
    let resultStr = `${key}: ${voteNo} votes`
    pollResults += newLine + resultStr;
  });
  return pollResults;
}


console.log(displayResults())

