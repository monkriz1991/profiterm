<script setup>
import jsPDF from "jspdf";

const calkObject = ref([]);
const visibleSteep = ref(true);
const activeNames = ref("");
const summEdit = ref([]);
const totalCost = ref(0);
const titleBlock = ref("");
const suumItem = ref([]);
const inputObject = ref({
  level: 0,
  name: "",
  unit: 0,
  type: "",
  cost: 0,
  unitcoefficient: 0,
  coefficient: 0,
  items: [],
});

const { data: rawTypecalk } = await useFetch("/api/typecalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
const { data: rawItemcalk } = await useFetch("/api/itemcalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

onMounted(() => {
  let typecalk = [];
  let itemcalk = [];

  try {
    typecalk =
      typeof rawTypecalk.value === "string"
        ? JSON.parse(rawTypecalk.value)
        : rawTypecalk.value;
    itemcalk =
      typeof rawItemcalk.value === "string"
        ? JSON.parse(rawItemcalk.value)
        : rawItemcalk.value;
  } catch (e) {
    console.error("Failed to parse JSON data:", e);
  }

  if (Array.isArray(typecalk) && Array.isArray(itemcalk)) {
    const typecalkMap = {};
    typecalk.sort((a, b) => a.level - b.level);
    typecalk.forEach((type) => {
      typecalkMap[type._id] = { ...type, items: [] };
    });
    itemcalk.forEach((item) => {
      if (typecalkMap[item.typecalk]) {
        typecalkMap[item.typecalk].items.push(item);
      }
    });

    calkObject.value = Object.values(typecalkMap);
  }
});

const nevStep = (itemWork, titleWork) => {
  inputObject.value.items = itemWork;
  titleBlock.value = titleWork;
  summEdit.value = itemWork.map(() => 0);
  suumItem.value = itemWork.map(() => 0);
  activeNames.value = itemWork[0]._id;
  visibleSteep.value = false;
};

const backStep = () => {
  totalCost.value = 0;
  summEdit.value = [];
  suumItem.value = [];
  visibleSteep.value = true;
};

watch(
  summEdit,
  (newValues) => {
    costWork(newValues);
  },
  { deep: true }
);

const costWork = (newValues) => {
  totalCost.value = 0;
  suumItem.value = [];

  inputObject.value.items.forEach((item, index) => {
    const quantity = parseFloat(newValues[index]) || 0;
    const itemCost = item.cost * quantity;

    let finalCost = itemCost;
    if (quantity >= (item.unitcoefficient || 0)) {
      const coefficientReduction = 1 - item.coefficient / 100;
      finalCost = itemCost * coefficientReduction;
    }

    totalCost.value += finalCost;
    suumItem.value[index] = finalCost;
  });
};

const generatePDF = () => {
  const doc = new jsPDF();

  doc.addFileToVFS("Roboto.ttf", RobotoBase64);
  doc.addFont("Roboto.ttf", "Roboto", "normal");
  doc.setFont("Roboto");
  doc.setFontSize(12);

  doc.text("Расчет стоимости работ", 10, 10);

  let y = 20;

  inputObject.value.items.forEach((item, index) => {
    const quantity = parseFloat(summEdit.value[index]) || 0;
    const itemCost = item.cost * quantity;
    let finalCost = itemCost;
    if (quantity >= (item.unitcoefficient || 0)) {
      const coefficientReduction = 1 - item.coefficient / 100;
      finalCost = itemCost * coefficientReduction;
    }
    doc.text(`------------------------------------------`, 10, y + 35);
    doc.text(`Тип работ ${index + 1}: ${item.name}`, 10, y);

    doc.text(
      `Стоимость за ${item.unit} ${item.type} : ${item.cost.toFixed(2)}руб.`,
      10,
      y + 20
    );
    doc.text(`Колличество: ${quantity} ${item.type}`, 10, y + 10);
    doc.text(`Стоимость: ${finalCost.toFixed(2)}руб.`, 10, y + 30);
    y += 40;
  });

  doc.text(`Итоговая стоимость: ${totalCost.value.toFixed(2)}руб.`, 10, y);
  doc.save("calculation.pdf");
};
</script>

<template>
  <div class="container">
    <br /><br /><br />
    <h1>title</h1>

    <div class="columns is-multiline" v-if="visibleSteep">
      <div
        class="column is-4"
        v-for="item in calkObject"
        :key="item._id"
        @click="nevStep(item.items, item.title)"
      >
        <div class="calk-block">
          <Icon v-if="item.icon" :name="item.icon" />
          <strong>{{ item.title }}</strong>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="calk-block-group">
        <div class="calk-block-group-title">
          <button class="button back-step is-white" @click="backStep">
            <span class="icon"
              ><Icon name="solar:round-alt-arrow-left-broken"
            /></span>
            <span>К списку</span>
          </button>
          {{ titleBlock }}
        </div>
        <el-collapse
          v-model="activeNames"
          v-for="(item, index) in inputObject.items"
          :key="item._id"
          class="calk-collapse"
        >
          <el-collapse-item :title="item.name" :name="item._id">
            <div class="calk-collapse-item">
              <strong>Стоимость:</strong>
              {{ item.cost }} <span>.руб</span><b>/</b>за {{ item.unit }}
              {{ item.type }}
            </div>
            <div class="field is-horizontal">
              <div class="field-body field-control">
                <div class="field">
                  <p class="control">
                    <input
                      class="input"
                      type="number"
                      v-model="summEdit[index]"
                      placeholder="Введите значение"
                    />
                  </p>
                </div>
              </div>
              <div class="field-label is-normal">
                <label class="label">{{ item.type }}</label>
              </div>
              <div class="calk-collapse-item-cost">
                <strong
                  >{{ suumItem[index].toFixed(2) }}<span> руб.</span></strong
                >
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="calk-block-cost">
          <button
            class="button save-pdf is-danger is-light"
            @click="generatePDF"
          >
            Вывести в PDF
          </button>
          <div>
            <span>Итоговая стоимость:</span>
            <strong>{{ totalCost.toFixed(2) }}<span> руб.</span></strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
