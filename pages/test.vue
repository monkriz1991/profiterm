<script setup>
import jsPDF from "jspdf";

// Инициализация переменных
const calkObject = ref([]);
const visibleSteep = ref(true);
const activeNames = ref([]);
const summEdit = ref([]);
const totalCost = ref(0);
const titleBlock = ref("");
const suumItem = ref([]);
const inputObject = ref({ items: [] });
const selectedValues = ref([]);
const checkedValues = ref([]);
const previousSelectedValues = ref([]);
const isCalculated = ref(false);

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

const filteredElementOptions = (item) => {
  if (!elementcalk.value || elementcalk.value.length === 0) {
    return [];
  }

  const idString = item.group;
  const ids = idString.split(",").map((id) => id.trim());

  return elementcalk.value
    .filter((el) => ids.includes(el._id))
    .map((el) => ({
      value: el._id,
      label: el.title,
    }));
};

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
  checkedValues.value = combined.map(() => true);
  activeNames.value = combined.map((item) => item._id); // Открыть все collapse items по умолчанию
  visibleSteep.value = false;
  isCalculated.value = false;
};

const backStep = () => {
  totalCost.value = 0;
  summEdit.value = [];
  suumItem.value = [];
  selectedValues.value = [];
  checkedValues.value = [];
  visibleSteep.value = true;
  isCalculated.value = false;
};

const costWork = () => {
  totalCost.value = 0;
  suumItem.value = [];

  if (!inputObject.value.items) return;

  let allFieldsFilled = true;

  inputObject.value.items.forEach((item, index) => {
    if (!checkedValues.value[index]) {
      suumItem.value[index] = 0;
      return;
    }

    const quantity = Number(summEdit.value[index]) || 0;

    // Исправленная проверка, учитывающая только типы с required элементом
    if (item.type && (!selectedValues.value[index] || quantity === 0)) {
      allFieldsFilled = false;
      //return;
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

  isCalculated.value = allFieldsFilled;
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
  costWork();
};

watch(
  selectedValues,
  (newValues) => {
    newValues.forEach((value, index) => {
      if (value !== previousSelectedValues.value[index]) {
        updateCost(value, index);
      }
    });
    previousSelectedValues.value = [...newValues];
  },
  { deep: true, immediate: true }
);

watch(
  summEdit,
  (newValues) => {
    costWork();
  },
  { deep: true }
);

const calculateTotal = () => {
  const valuesArray = Array.from(summEdit.value);
  let allFieldsFilled = true;

  inputObject.value.items.forEach((item, index) => {
    if (!checkedValues.value[index]) return; // Игнорировать заблокированные элементы

    if (item.type && !valuesArray[index]) {
      allFieldsFilled = false;
    }

    if (!item.type && (!selectedValues.value[index] || !valuesArray[index])) {
      allFieldsFilled = false;
    }
  });

  if (allFieldsFilled) {
    costWork();
    isCalculated.value = true;
  } else {
    openNotif();
  }
};

const generatePDF = () => {
  const doc = new jsPDF();

  doc.addFileToVFS("Roboto.ttf", RobotoBase64);
  doc.addFont("Roboto.ttf", "Roboto", "normal");
  doc.setFont("Roboto");
  doc.setFontSize(12);

  doc.text("Расчет стоимости работ", 10, 10);

  let y = 20;
  //   let totalCost = 0; // Инициализация переменной для итоговой стоимости

  inputObject.value.items.forEach((item, index) => {
    // Проверяем состояние переключателя
    const isChecked = checkedValues.value[index];

    // Пропускаем элемент, если переключатель выключен
    if (!isChecked) {
      return;
    }

    const quantity = parseFloat(summEdit.value[index]) || 0;
    const itemCost = item.cost * quantity;
    let finalCost = itemCost;
    if (quantity >= (item.unitcoefficient || 0)) {
      const coefficientReduction = 1 - (item.coefficient || 0) / 100;
      finalCost = itemCost * coefficientReduction;
    }

    // Обновляем итоговую стоимость
    // totalCost += finalCost;

    const selectedLabel = selectedValues.value[index]
      ? elementcalk.value.find((el) => el._id === selectedValues.value[index])
          ?.title || "Не выбрано"
      : "Не выбрано";

    doc.text(`------------------------------------------`, 10, y + 20);
    doc.text(`Тип работ ${index + 1}: ${item.name || item.title}`, 10, y);

    if (item.type) {
      doc.text(`Количество: ${quantity} ${item.type}`, 10, y + 10);
    } else {
      doc.text(`Выбранный элемент: ${selectedLabel}`, 10, y + 10);
    }

    y += 30;
  });

  // Проверяем, что итоговая стоимость определена и корректна
  doc.text(`Итоговая стоимость: ${totalCost.value.toFixed(2)} руб.`, 10, y);

  doc.save("calculation.pdf");
};

const updateSummEdit = (index, value) => {
  summEdit.value[index] = value ? Number(value) : 0;
};

const isSmallScreen = ref(false);

const handleResize = () => {
  isSmallScreen.value = window.innerWidth < 500;
};

onMounted(() => {
  handleResize(); // Устанавливаем начальное значение
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
const openNotif = () => {
  ElNotification({
    title: "Ошибка",
    message: "Выберите и заполните все значения!",
    type: "error",
  });
};
const openNotifPdf = () => {
  ElNotification({
    title: "Ошибка",
    message: "Рассчитайте изначально стоимость!",
    type: "error",
  });
};
</script>

<template>
  <div class="container">
    <div class="content">
      <div class="columns is-multiline">
        <div class="column">
          <h1 class="h1-calk">Калькулятор</h1>
        </div>
      </div>
      <div class="columns is-multiline" v-if="visibleSteep">
        <div
          class="column is-4"
          v-for="item in calkObject"
          :key="item._id"
          :class="{ disabled_cack_check: item.show_check }"
          @click="
            item.show_check
              ? null
              : nevStep(item.items, item.groups, item.title)
          "
        >
          <div class="calk-block">
            <Icon v-if="item.icon" :name="item.icon" />
            <strong>{{ item.title }}</strong>
          </div>
        </div>
      </div>
      <div class="columns is-multiline" v-else>
        <div class="column is-12">
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
                          :value="summEdit[index] === 0 ? '' : summEdit[index]"
                          placeholder="Введите значение"
                          :disabled="!checkedValues[index]"
                          @input="updateSummEdit(index, $event.target.value)"
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
                      @change="costWork()"
                      class="ml-2"
                      size="large"
                      :disabled="item.show_check"
                      style="
                        --el-switch-on-color: #13ce66;
                        --el-switch-off-color: #ff4949;
                      "
                    />
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
                          v-for="option in filteredElementOptions(
                            inputObject.items[index]
                          )"
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
                      @change="costWork()"
                      class="ml-2"
                      size="large"
                      :disabled="item.show_check"
                      style="
                        --el-switch-on-color: #13ce66;
                        --el-switch-off-color: #ff4949;
                      "
                    />
                  </div>
                </div>
                <div class="full-width">
                  {{ item.description }}
                </div>
              </el-collapse-item>
            </el-collapse>
            <div
              :class="{
                'calk-block-cost': true,
                'reversed-order': isSmallScreen,
              }"
            >
              <button
                v-if="isCalculated"
                class="button save-pdf is-danger is-light"
                @click="generatePDF"
                :disabled="!isCalculated"
              >
                Вывести в PDF
              </button>
              <button
                v-else
                class="button save-pdf is-danger is-light"
                @click="openNotifPdf"
              >
                Вывести в PDF
              </button>
              <div v-if="isCalculated">
                <span>Итоговая стоимость:</span>
                <strong>{{ totalCost.toFixed(2) }}<span> руб.</span></strong>
              </div>
              <button
                class="button calculate-cost is-primary is-light"
                @click="calculateTotal"
                v-else
              >
                Рассчитать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
