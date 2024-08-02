<script setup>
import { ref, computed, onMounted, watch } from "vue";
import jsPDF from "jspdf";

// Инициализация переменных
const calkObject = ref([]);
const visibleSteep = ref(true);
const activeNames = ref("");
const summEdit = ref([]);
const totalCost = ref(0);
const titleBlock = ref("");
const suumItem = ref([]);
const inputObject = ref({ items: [] }); // Инициализируем с пустым массивом
const selectedValues = ref([]);
const checkedValues = ref([]);
const previousSelectedValues = ref([]);

const rawGroupcalk = await $fetch("/api/groupcalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

const { data: elementcalk } = await useFetch("/api/elementcalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
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

const elementOptions = computed(() => {
  if (!elementcalk.value || elementcalk.value.length === 0) {
    return [];
  }
  return elementcalk.value.map((el) => ({
    value: el._id,
    label: el.title,
  }));
});

onMounted(async () => {
  let typecalk = [];
  let itemcalk = [];
  let groupcalk = [];

  try {
    typecalk =
      typeof rawTypecalk.value === "string"
        ? JSON.parse(rawTypecalk.value)
        : rawTypecalk.value;
    itemcalk =
      typeof rawItemcalk.value === "string"
        ? JSON.parse(rawItemcalk.value)
        : rawItemcalk.value;
    groupcalk =
      typeof rawGroupcalk === "string"
        ? JSON.parse(rawGroupcalk)
        : rawGroupcalk;
  } catch (e) {
    console.error("Failed to parse JSON data:", e);
  }

  if (
    Array.isArray(typecalk) &&
    Array.isArray(itemcalk) &&
    Array.isArray(groupcalk)
  ) {
    const typecalkMap = {};
    typecalk.sort((a, b) => a.level - b.level);
    typecalk.forEach((type) => {
      typecalkMap[type._id] = { ...type, items: [], groups: [] };
    });
    itemcalk.forEach((item) => {
      if (typecalkMap[item.typecalk]) {
        typecalkMap[item.typecalk].items.push(item);
      }
    });

    groupcalk.forEach((group) => {
      if (typecalkMap[group.typecalk]) {
        typecalkMap[group.typecalk].groups.push(group);
      }
    });

    calkObject.value = Object.values(typecalkMap).map((type) => {
      type.items.sort((a, b) => a.level - b.level);
      type.groups.sort((a, b) => a.level - b.level);
      return type;
    });
  }

  // Инициализация checkedValues значением true для каждого элемента после загрузки данных
  checkedValues.value = inputObject.value.items.map(() => true);
});

const nevStep = (itemWork, groups, titleWork) => {
  const processedGroups = groups.map((group) => {
    if (typeof group.group === "string" && group.group.trim() !== "") {
      return {
        ...group,
        groupArray: group.group.split(","),
      };
    }
    return {
      ...group,
      groupArray: [],
    };
  });

  const combined = [...itemWork, ...processedGroups].sort(
    (a, b) => a.level - b.level
  );

  inputObject.value.items = combined;

  titleBlock.value = titleWork;
  summEdit.value = combined.map(() => 0);
  suumItem.value = combined.map(() => 0);
  selectedValues.value = combined.map(() => null);
  checkedValues.value = combined.map(() => true); // Установить значение по умолчанию для чекбоксов
  if (combined.length > 0) {
    activeNames.value = combined[0]._id;
  }
  visibleSteep.value = false;
};

const backStep = () => {
  totalCost.value = 0;
  summEdit.value = [];
  suumItem.value = [];
  selectedValues.value = [];
  checkedValues.value = [];
  visibleSteep.value = true;
};

const costWork = (newValues) => {
  totalCost.value = 0;
  suumItem.value = [];

  const valuesArray = Array.from(newValues);

  if (!inputObject.value.items) return; // Защита от ошибок

  inputObject.value.items.forEach((item, index) => {
    if (!checkedValues.value[index]) {
      suumItem.value[index] = 0;
      return;
    }

    const quantity = Number(valuesArray[index]) || 0;

    if (quantity === 0) {
      return;
    }

    let finalCost = 0;

    if (item.cost !== undefined) {
      const itemCost = (Number(item.cost) || 0) * quantity;

      if (
        item.unitcoefficient !== undefined &&
        item.coefficient !== undefined
      ) {
        if (quantity >= Number(item.unitcoefficient)) {
          const coefficientReduction =
            1 - (Number(item.coefficient) || 0) / 100;
          finalCost = itemCost * coefficientReduction;
        } else {
          finalCost = itemCost;
        }
      } else {
        finalCost = itemCost;
      }
    } else {
      finalCost = quantity;
    }

    totalCost.value += finalCost;
    suumItem.value[index] = finalCost;
  });
  suumItem.value = suumItem.value.filter((value) => value !== 0);
};

const updateCost = (selectedId, index) => {
  const selectedElement = elementcalk.value.find((el) => el._id === selectedId);
  if (selectedElement) {
    const itemCost = selectedElement.cost || 0;
    if (summEdit.value[index] !== itemCost) {
      summEdit.value[index] = itemCost;
    }
  } else {
    if (summEdit.value[index] !== 0) {
      summEdit.value[index] = 0;
    }
  }
  costWork(summEdit.value);
};

watch(
  selectedValues,
  (newValues) => {
    newValues.forEach((value, index) => {
      if (value !== previousSelectedValues.value[index]) {
        updateCost(value, index);
      }
    });
    // Обновляем предыдущие значения
    previousSelectedValues.value = [...newValues];
  },
  { deep: true, immediate: true } // Используем deep и immediate, чтобы отслеживать все изменения
);

watch(
  summEdit,
  (newValues) => {
    costWork(newValues);
  },
  { deep: true }
);

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

    doc.text(`Количество: ${quantity} ${item.type}`, 10, y + 10);
    y += 40;
  });

  doc.text(`Итоговая стоимость: ${totalCost.value.toFixed(2)} руб.`, 10, y);
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
        @click="nevStep(item.items, item.groups, item.title)"
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
            <span class="icon">
              <Icon name="solar:round-alt-arrow-left-broken" />
            </span>
            <span>К списку</span>
          </button>
          {{ titleBlock }}
        </div>
        <el-collapse v-model="activeNames" class="calk-collapse">
          <el-collapse-item
            v-for="(item, index) in inputObject.items"
            :key="item._id"
            :title="item.name || item.title"
            :name="item._id"
          >
            <div class="field is-horizontal" v-if="item.type">
              <div class="field-body field-control">
                <div class="field">
                  <p class="control">
                    <input
                      class="input"
                      type="number"
                      v-model.number="summEdit[index]"
                      placeholder="Введите значение"
                      :disabled="!checkedValues[index]"
                    />
                  </p>
                </div>
              </div>
              <div class="field-label is-normal">
                <label class="label">{{ item.type }}</label>
              </div>
              <div class="field-label has-text-right">
                <el-switch
                  v-model="checkedValues[index]"
                  @change="costWork(summEdit)"
                  class="ml-2"
                  size="large"
                  style="
                    --el-switch-on-color: #13ce66;
                    --el-switch-off-color: #ff4949;
                  "
                />
                <!-- <label>Учитывать в расчете</label> -->
              </div>
            </div>
            <div class="field is-horizontal" v-else>
              <div class="field-body field-control">
                <div class="field">
                  <el-select
                    v-model="selectedValues[index]"
                    clearable
                    size="large"
                    placeholder="Выберите тип"
                    style="width: 240px"
                    @change="(value) => updateCost(value, index)"
                  >
                    <el-option
                      v-for="option in elementOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                </div>
              </div>

              <div class="field-label has-text-right">
                <el-switch
                  v-model="checkedValues[index]"
                  @change="costWork(summEdit)"
                  class="ml-2"
                  size="large"
                  style="
                    --el-switch-on-color: #13ce66;
                    --el-switch-off-color: #ff4949;
                  "
                />
                <!-- <label>Учитывать в расчете</label> -->
              </div>
            </div>
            <div class="full-width">
              {{ item.description }}
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
