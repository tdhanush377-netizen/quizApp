import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= TYPES ================= */
type Screen = "TOPICS" | "QUIZ" | "RESULT";

type Option = { id: string; text: string };
type Question = {
  id: number;
  question: string;
  options: Option[];
  correct: string;
  explanation: string; // ✅ ADDED
};
type Topic = {
  id: number;
  title: string;
  questions: Question[];
};

/* ================= REAL UPSC QUESTIONS ================= */
const TOPICS: Topic[] = [
  {
    id: 1,
    title: "Indian National Movement",
    questions: [
      {
        id: 1,
        question: "In which year was the Indian National Congress founded?",
        correct: "A",
        explanation:
          "The Indian National Congress was founded in 1885 to provide a common platform for educated Indians to express political demands and grievances. It was established by A.O. Hume with the support of Indian leaders. Over time, the INC became the central organization of India’s freedom struggle, leading movements against British colonial rule and shaping India’s democratic framework.",
        options: [
          { id: "A", text: "1885" },
          { id: "B", text: "1905" },
          { id: "C", text: "1919" },
          { id: "D", text: "1929" },
        ],
      },
      {
        id: 2,
        question: "Who founded the Indian National Congress?",
        correct: "B",
        explanation:
          "The Indian National Congress was founded by Allan Octavian Hume, a retired British civil servant. He aimed to create a platform where Indians could discuss political issues peacefully. With the cooperation of Indian leaders, Hume helped establish the INC in 1885, which later evolved into the main force behind India’s independence movement.",
        options: [
          { id: "A", text: "Mahatma Gandhi" },
          { id: "B", text: "A.O. Hume" },
          { id: "C", text: "Dadabhai Naoroji" },
          { id: "D", text: "Bal Gangadhar Tilak" },
        ],
      },
      {
        id: 3,
        question: "The Partition of Bengal took place in which year?",
        correct: "B",
        explanation:
          "The Partition of Bengal was carried out in 1905 by Lord Curzon. The British administration claimed it was done for administrative convenience, but the real intention was to divide the nationalist movement. This decision led to widespread protests and the Swadeshi Movement, strengthening India’s freedom struggle.",
        options: [
          { id: "A", text: "1885" },
          { id: "B", text: "1905" },
          { id: "C", text: "1911" },
          { id: "D", text: "1920" },
        ],
      },
    ],
  },
];

/* ================= HEADER ================= */
const Header = ({
  title,
  showBack,
  onBack,
}: {
  title: string;
  showBack: boolean;
  onBack?: () => void;
}) => (
  <View style={styles.header}>
    {showBack ? (
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.backBtn} />
    )}
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={styles.backBtn} />
  </View>
);

/* ================= APP ================= */
export default function App() {
  const [screen, setScreen] = useState<Screen>("TOPICS");
  const [topic, setTopic] = useState<Topic | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  /* ================= TOPICS ================= */
  if (screen === "TOPICS") {
    return (
      <ScrollView style={styles.container}>
        <Header title="Quiz Practice" showBack onBack={() => setScreen("TOPICS")} />

        {TOPICS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={styles.card}
            onPress={() => {
              setTopic(t);
              setAnswers({});
              setMarked([]);
              setScreen("QUIZ");
            }}
          >
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.sub}>{t.questions.length} Questions</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  if (!topic) return null;

  const attempted = Object.keys(answers).length;
  const skipped = topic.questions.length - attempted;
  const correctCount = topic.questions.filter(
    (q) => answers[q.id] === q.correct
  ).length;
  const wrongCount = attempted - correctCount;
  const score = ((correctCount / topic.questions.length) * 100).toFixed(1);

  /* ================= RESULT ================= */
  if (screen === "RESULT") {
    return (
      <ScrollView style={styles.container}>
        <Header title="Test Results" showBack onBack={() => setScreen("TOPICS")} />

        <View style={styles.resultCard}>
          <Text style={styles.score}>{score}%</Text>
          <Text style={styles.scoreLabel}>Score</Text>
          <View style={styles.row}>
            <Text style={styles.resultText}>{correctCount}{"\n"}Correct</Text>
            <Text style={styles.resultText}>{wrongCount}{"\n"}Wrong</Text>
            <Text style={styles.resultText}>{skipped}{"\n"}Skipped</Text>
          </View>
        </View>

        {topic.questions.map((q, idx) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correct;

          return (
            <View key={q.id} style={styles.card}>
              <View style={styles.qHeader}>
                <Text style={styles.qNumber}>Question {idx + 1}</Text>
                <Text
                  style={[
                    styles.badge,
                    {
                      backgroundColor: isCorrect ? "#e6f4ea" : "#fdecea",
                      color: isCorrect ? "#2e7d32" : "#d32f2f",
                    },
                  ]}
                >
                  {isCorrect ? "Correct" : "Wrong"}
                </Text>
              </View>

              <Text style={styles.title}>{q.question}</Text>

              {q.options.map((o) => {
                const isUser = o.id === userAnswer;
                const isAns = o.id === q.correct;

                return (
                  <View
                    key={o.id}
                    style={[
                      styles.option,
                      isAns && styles.correctOption,
                      isUser && !isAns && styles.wrongOption,
                    ]}
                  >
                    <View
                      style={[
                        styles.dot,
                        isAns && styles.dotCorrect,
                        isUser && !isAns && styles.dotWrong,
                      ]}
                    />
                    <Text>
                      {o.id}. {o.text}{" "}
                      {isAns && "✓ Correct Answer"}
                      {isUser && !isAns && "✗ Your Answer"}
                    </Text>
                  </View>
                );
              })}

              {/* ✅ EXPLANATION (AFTER SUBMIT ONLY) */}
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>Explanation</Text>
                <Text style={styles.explanationText}>{q.explanation}</Text>
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => {
            setAnswers({});
            setMarked([]);
            setScreen("QUIZ");
          }}
        >
          <Text style={styles.submitText}>RETAKE QUIZ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: "#555" }]}
          onPress={() => setScreen("TOPICS")}
        >
          <Text style={styles.submitText}>BACK TO TOPICS</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  /* ================= QUIZ ================= */
  return (
    <View style={styles.container}>
      <Header title={topic.title} showBack onBack={() => setScreen("TOPICS")} />

      <Text style={styles.sub}>
        Attempted: {attempted}/{topic.questions.length}
      </Text>

      <ScrollView>
        {topic.questions.map((q, idx) => {
          const isMarked = marked.includes(q.id);

          return (
            <View key={q.id} style={[styles.card, isMarked && styles.markedCard]}>
              <Text style={styles.qNumber}>Question {idx + 1}</Text>
              <Text style={styles.title}>{q.question}</Text>

              {q.options.map((o) => {
                const selected = answers[q.id] === o.id;

                return (
                  <TouchableOpacity
                    key={o.id}
                    style={[styles.option, selected && styles.selected]}
                    onPress={() =>
                      setAnswers({ ...answers, [q.id]: o.id })
                    }
                  >
                    <View
                      style={[
                        styles.radio,
                        selected && styles.radioSelected,
                      ]}
                    >
                      {selected && <View style={styles.radioDot} />}
                    </View>
                    <Text>{o.id}. {o.text}</Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                onPress={() =>
                  setMarked((prev) =>
                    prev.includes(q.id)
                      ? prev.filter((id) => id !== q.id)
                      : [...prev, q.id]
                  )
                }
              >
                <Text style={[styles.mark, isMarked && styles.markActive]}>
                  {isMarked ? "Marked for Review" : "Mark for Review"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.submitText}>SUBMIT TEST</Text>
      </TouchableOpacity>

      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Submit Test?</Text>
            <Text style={styles.modalSub}>
              Review your test submission details before confirming.
            </Text>

            <View style={styles.statRow}>
              <View style={[styles.statBox, styles.statAttempted]}>
                <Text style={styles.statNumber}>{attempted}</Text>
                <Text style={styles.statLabel}>Attempted</Text>
              </View>
              <View style={[styles.statBox, styles.statMarked]}>
                <Text style={styles.statNumber}>{marked.length}</Text>
                <Text style={styles.statLabel}>Marked</Text>
              </View>
              <View style={[styles.statBox, styles.statSkipped]}>
                <Text style={styles.statNumber}>{skipped}</Text>
                <Text style={styles.statLabel}>Skipped</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={() => {
                setShowModal(false);
                setScreen("RESULT");
              }}
            >
              <Text style={styles.submitText}>Submit & Check All</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    height: 80,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { width: 50, alignItems: "center" },
  backText: { fontSize: 28, color: "#1e5eff" },
  headerTitle: { flex: 1, textAlign: "center", fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    margin: 10,
  },
  markedCard: { borderWidth: 1, borderColor: "#ff9800" },

  title: { fontSize: 15, fontWeight: "600", marginBottom: 6 },
  sub: { color: "#666", marginHorizontal: 12, marginBottom: 6 },

  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  selected: { backgroundColor: "#e9f2ff", borderColor: "#1e5eff" },

  correctOption: { borderColor: "green", backgroundColor: "#eaffea" },
  wrongOption: { borderColor: "red", backgroundColor: "#ffeaea" },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#bbb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioSelected: { borderColor: "#1e5eff" },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1e5eff",
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#bbb",
  },
  dotCorrect: { borderColor: "green", backgroundColor: "green" },
  dotWrong: { borderColor: "red", backgroundColor: "red" },

  qHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  qNumber: { fontWeight: "bold" },

  badge: {
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 12,
  },

  mark: { marginTop: 5, color: "#555" },
  markActive: { color: "#ff9800", fontWeight: "bold" },

  submitBtn: {
    backgroundColor: "#1e5eff",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    margin: 10,
  },
  submitText: { color: "#fff", fontWeight: "bold" },

  resultCard: {
    backgroundColor: "#1e5eff",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
    margin: 10,
  },
  score: { fontSize: 32, color: "#fff", fontWeight: "bold" },
  scoreLabel: { color: "#fff" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  resultText: { color: "#fff", textAlign: "center" },

  explanationBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#1e5eff",
  },
  explanationTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1e5eff",
  },
  explanationText: {
    color: "#444",
    lineHeight: 20,
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  modalSub: { color: "#666", marginVertical: 10 },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 14,
  },
  statBox: {
    width: "30%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  statAttempted: { backgroundColor: "#e9f8ef" },
  statMarked: { backgroundColor: "#fff4e5" },
  statSkipped: { backgroundColor: "#f2f2f2" },
  statNumber: { fontSize: 18, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#555" },

  modalSubmitBtn: {
    backgroundColor: "#1e5eff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  cancel: { textAlign: "center", color: "#666" },
});
