<script setup>
import { useAuthStore } from '../stores/auth';
import { ref, onMounted, reactive } from 'vue';
import bookService from '../api/bookService';
import questionnaireService from '../api/questionnaireService';

const authStore = useAuthStore();
const title = ref('')
const titleCopy = ref('')
const pdfFile = ref(null);
const message = ref('');
const showModal = ref(false);
const selectedFileName = ref('');
const questionnaires = ref([]);
const error = ref('');
const selectedText = ref('');
let questionnaireDict = reactive({});
let currentIndex = ref(0);
let currentKey = ref('')
let currentValue = ref('')
let keys = ref(Object.keys(questionnaireDict));
const answer = ref(true);
const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

function changeAnswer() {
  answer.value = !answer.value;
}

function displayCurrentItem() {
  if (keys.value.length === 0) {
    return;
  }
  currentKey.value = keys.value[currentIndex.value];
  currentValue.value = questionnaireDict[currentKey.value];
}

function showNextItem() {
  if (keys.value.length === 0) {
    return;
  }
  if (currentIndex.value >= keys.value.length - 1) {
    currentIndex.value = 0;
  } else {
    currentIndex.value++;
  }
  answer.value = true;
  displayCurrentItem();
}

function showPreviousItem() {
  if (keys.value.length === 0) {
    return;
  }
  if (currentIndex.value <= 0) {
    currentIndex.value = keys.value.length - 1;
  } else {
    currentIndex.value--;
  }
  answer.value = true;
  displayCurrentItem();
}

const questionairreList = (async () => {

  if (!authStore.username) {
    error.value = 'Please log in to view questionnaires.';
    return;
  }

  try {
    const response = await questionnaireService.getallquestionairre();
    questionnaires.value = response.data;
  } catch (err) {
    error.value = err.response?.status === 401 ? 'Please log in to view questionnaires generated.' : 'Failed to load questionairres. Please reload the page';
  }

});

onMounted(() => {

  questionairreList();
});

const fetchQuestionnaireText = async (id) => {
  try {

    const response = await questionnaireService.getquestionairre(id);
    selectedText.value = response.data;
    questionnaireDict = {};
    const lines = selectedText.value.split('\n').filter(line => line.trim() !== '')

    lines.forEach(line => {
      let [question, answer] = line.split(';').map(part => part.trim());
      if (question && answer) {
        question = question.replaceAll("<br>", '\n');
        answer = answer.replaceAll("<br>", '\n');

        questionnaireDict[question] = answer;
      }
    });
    currentIndex.value = 0;
    keys.value = Object.keys(questionnaireDict);

    answer.value = true;
    displayCurrentItem()
  } catch (err) {
    error.value = err.response?.status === 401 ? 'Please log in to view questionnaire text.' : 'Failed to load questionnare text. Please try again.'
  }
}

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  title.value = '';
  pdfFile.value = null;
  message.value = '';
  selectedFileName.value = '';
};


const handleUpload = async () => {

  if (!title.value || !pdfFile.value) {
    message.value = 'Please provide both a title and a PDF file.';
    return;
  }

  title.value = title.value.replaceAll(" ", '_')
  titleCopy.value = title.value + Date.now().toString(36) + Math.random().toString(36).slice(2);
  const formData = new FormData();
  formData.append('title', titleCopy.value);
  formData.append('file', pdfFile.value);

  try {
    const response = await bookService.uploadBook(formData);
    message.value = 'Generating questions please wait a moment!';


    const questionairreFormData = new FormData();
    questionairreFormData.append('book', response.data.title);
    questionairreFormData.append('detail_level', "basic");

    const response2 = await questionnaireService.generateQuestionairre(questionairreFormData);
    questionairreList();
    fetchQuestionnaireText(response2.data.id);
    setTimeout(() => {
      closeModal();
    }, 1500);
  } catch (error) {
    message.value = error.response?.data?.error || 'Upload failed. Please try again.';

  }
};

const handleFileChange = (event) => {
  pdfFile.value = event.target.files[0];
  selectedFileName.value = pdfFile.value ? pdfFile.value.name : '';
};





</script>

<template>

  <div class="content-wrapper">

    <div class="upload-section">

      <div class="style-hamburger">
        <button class="hamburger" @click="toggleMenu">☰</button>
      </div>
      <div class="menu-content" :class="{ 'show-menu': showMenu }">
        <div class="gen-quiz">
          <button @click="openModal" class="upload">Generate Question</button>
        </div>

        <div v-if="questionnaires.length" class="questionnaire-list">
          <div v-for="questionnaire in questionnaires" :key="questionnaire.id" class="questionnaire-item"
            @click="fetchQuestionnaireText(questionnaire.id)">
            <h4>{{ questionnaire.question_answers_file.slice(17).slice(0, -32) }}</h4>
          </div>

        </div>

      </div>


    </div>

    <div class="box" :class="{ 'show-card': showMenu }">
      <div class="card">
        <p v-if="currentKey === ''" class="question">Question will be shown here. First generate a question or Choose
          from
          your already generated list</p>
        <p v-else class="question">{{ answer ? currentKey : currentValue }}</p>
        <button @click="changeAnswer" id="answer">{{ answer ? 'Answer' : 'Question' }}</button>
      </div>
      <div class="change">

        <button @click="showPreviousItem" class="previous">
          <p>&larr; Previous</p>
        </button>

        <button @click="showNextItem()" class="next">
          <p>Next &rarr;</p>
        </button>
      </div>

    </div>

  </div>


  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h3>Upload a Pdf file</h3>
      <input v-model="title" placeholder="Questionnaire Title" class="title-input" />
      <div class="input-row">
        <input type="file" accept=".pdf, application/pdf" @change="handleFileChange" class="file-input" />
        <span class="file-name">{{ selectedFileName }}</span>
      </div>
      <div class="modal-buttons">
        <button @click="handleUpload" class="upload-confirm" :disabled="!pdfFile">Generate Quiz</button>
        <button @click="closeModal" class="cancel-button">Cancel</button>
      </div>
      <p v-if="message" :class="{ 'success': !message.includes('failed'), 'error': message.includes('failed') }">{{
        message }}
      </p>
    </div>
  </div>

</template>

<style scoped>
.content-wrapper {
  display: flex;
  overflow-y: auto;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.upload-section {
  display: flex;
  flex-direction: column;
  flex: 0.7;
  align-self: flex-start;
}

.gen-quiz {
  display: flex;
 
}

.questionnaire-list {
  max-height: 400px;
  overflow-y: auto;
  width: 80%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 0.5;
}


.upload {
  color: #FDFCFE;
  background-color: #8965A3;
  border: none;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  text-align: center;
  padding: 0.4rem 0.3rem;

}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1D1E26;
  padding: 20px;
  border-radius: 10px;
  width: 90vw;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  color: #FDFCFE;
}

.modal-content h3 {
  margin: 0;
  font-size: 1.5rem;
  text-align: center;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-input,
.file-input {
  padding: 5px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  color: #1D1E26;
  width: 100%;
}

.file-name {
  color: #FDFCFE;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;

}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.upload-confirm,
.cancel-button {
  color: #FDFCFE;
  border: none;
  font-size: 1.1rem;
  border-radius: 50px;
  height: 30px;
  padding: 0 15px;
  cursor: pointer;
}

.upload-confirm {
  background-color: #8965A3;
}

.upload-confirm:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #555;
}

p {
  margin: 10px 0 0;
  text-align: center;
}

.success {
  color: green;
}

.error {
  color: #ff6b6b;
  text-align: center;
  margin-top: 20px;
}


.questionnaire-item {
  background-color: #1D1E26;
  padding: 15px;
  border-radius: 10px;
  color: #FDFCFE;
  cursor: pointer;
  max-width: 12rem;
}

.questionnaire-item h4 {
  margin: 0;
  font-size: 1.2rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.no-questionnaires {
  color: #FDFCFE;
  text-align: center;
  margin-top: 20px;
}

.change {
  width: 100%;
  max-width: 420px;
  display: flex;
  justify-content: space-between;
}

.previous {
  background-color: #1D1E26;
  padding: 0px 10px 5px 10px;
  height: 40px;
  margin-top: 10px;
  margin-left: 0px;
  color: #8E929D;
  border-radius: 50px;
  border-style: solid;
  border: none;

}

.previous p {
  display: inline-block;
  text-align: center;
  font-size: 1rem;
  margin-top: 10%;
}

.next {
  background-color: #1D1E26;
  padding: 0px 10px 5px 10px;
  max-width: 100px;
  height: 40px;
  margin-top: 10px;
  color: #8E929D;
  border-radius: 50px;
  border-style: solid;
  border: none;
}

.next p {
  display: inline-block;
  text-align: center;
  font-size: 1rem;
  margin-top: 10%;
}

.box {
  flex: 2;
  justify-content: center;
  height: auto;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

.card {
  max-width: 420px;
  height: 310px;
  background-color: #222226;
  color: #FDFCFE;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.question {
  margin-top: 30px;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 1.5rem;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  padding-right: 10px;
  box-sizing: border-box;
  flex: 1;
}

#answer {
  background-color: #8965A3;
  color: #FDFCFE;
  padding: 0px 15px;
  border-radius: 50px;
  max-width: 120px;
  height: 45px;
  font-size: 1.1rem;
  border: none;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.hamburger {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .content-wrapper {
    display: flex;
    justify-content: start;
    align-items: start;
  }

  .left {
    display: flex;
    justify-content: start;
    align-items: start;
  }

  .style-hamburger {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
  }

  .hamburger {
    text-align: left;

  }

  .upload-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }

  .menu-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    align-items: end;
    text-align: start;
  }

  .menu-content {
    display: none;
    z-index: 2;
  }

  .show-card {
    display: none;
  }

  .show-menu {
    display: flex;
  }
}
</style>
