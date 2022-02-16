import { useEffect, useMemo, useState } from "react";
import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  child,
  getDatabase,
  push,
  ref,
  update,
  onValue,
} from "firebase/database";

import "./index.scss";

const firebaseConfig: FirebaseOptions | undefined = undefined;
/*
const firebaseConfig = {
  apiKey: "AIzaSyBzcyQ2UqKy87E7f2mVKC3TU9zqqPtrI58",
  authDomain: "tan-rating.firebaseapp.com",
  projectId: "tan-rating",
  storageBucket: "tan-rating.appspot.com",
  messagingSenderId: "667111790867",
  appId: "1:667111790867:web:f3ff1b99ae1197c24762e6",
  measurementId: "G-R7R9GYNDJ2",
  databaseURL:
    "https://tan-rating-default-rtdb.europe-west1.firebasedatabase.app",
};
*/

type Answers = {
  [key: number]: number;
};

const questions = [
  " communicates well within the team",
  " keeps me updated on the status of his tasks",
  " produce meaningful feedback for me and other team members",
  " assists more junior members of the team",
  " liaises well with the back end team and other project stakeholders",
];

const options = [
  "Strongly agree",
  "Agree",
  "Neither agree nor disagree",
  "Disagree",
  "Strongly disagree",
];

const users = ["Sam", "Pedro", "Andres"];

function getQueryVariable(term: string) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) === term) {
      return decodeURIComponent(pair[1]);
    }
  }
  return "";
}

function App() {
  const database = useMemo(() => {
    if (firebaseConfig) {
      const firebaseApp = initializeApp(firebaseConfig);
      return getDatabase(firebaseApp);
    } else {
      return undefined;
    }
  }, []);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState<undefined | boolean>(undefined);
  function submit() {
    if (database) {
      const db = ref(database);
      const newKey = push(child(db, "answers")).key;
      const updates = {
        [`answers/${newKey}}`]: answers,
      };
      setSubmitted(false);
      update(db, updates)
        .then(() => {
          console.log("updated");
          setSubmitted(true);
        })
        .catch((error) => {
          console.error(error);
          setSubmitted(undefined);
        });
    }
  }
  const [scores, setScores] = useState<Answers>({});

  useEffect(() => {
    if (database) {
      const answersRef = ref(database, "answers");
      onValue(answersRef, (snapshot) => {
        const data = snapshot.val();
        setScores(
          Object.keys(data).reduce((acc, key) => {
            Object.values(data[key]).forEach((value, index) => {
              if (acc[index] === undefined) acc[index] = 0;
              acc[index] += data[key][index] / Object.keys(data).length;
            });
            return acc;
          }, {} as Answers)
        );
      });
    }
  }, [database]);

  const showAverage = window.location.search.includes("inchhighbison");
  const queryUser = getQueryVariable("user");
  const user = users.includes(queryUser) ? queryUser : "User";
  const disabled =
    database === undefined || submitted !== undefined || user === "User";

  return (
    <div className="app">
      <h1 className="app__title">
        Please fill out the answers below and hit submit - all submissions are
        completely anonymous.
      </h1>
      <section
        className={`app__questions${
          disabled ? " app__questions--submitted" : ""
        }`}
      >
        {questions.map((question, q) => (
          <div className="app__question question" key={question}>
            <p className="question__q">
              {user}
              {question}
              {showAverage && (
                <span className="question__average">
                  {" "}
                  - {(scores[q] || 0).toFixed(2)}
                </span>
              )}
            </p>
            <div className="question__options">
              {options.map((option, i) => (
                <label key={`${question}${i}`} className="question__label">
                  <input
                    className="question__input"
                    type="radio"
                    value="1"
                    checked={answers[q] === i + 1}
                    disabled={disabled}
                    onChange={() => setAnswers({ ...answers, [q]: i + 1 })}
                  />
                  <span className="question__span">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </section>
      <button
        className="app__submit"
        onClick={submit}
        disabled={disabled || Object.keys(answers).length !== questions.length}
      >
        Submit answers
      </button>
      {submitted && (
        <p className="app__submitted">
          Thank you for your answers. You can now close this tab.
        </p>
      )}
    </div>
  );
}

export default App;
