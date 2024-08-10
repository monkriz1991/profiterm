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
const totalCostPdf = ref("");

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
        const groupCopy = {
          ...group,
          groupArray:
            typeof group.group === "string" && group.group.trim() !== ""
              ? group.group.split(",")
              : [],
        };
        typecalkMap[group.typecalk].groups.push(groupCopy);
      }
    });
    let count = 0;

    calkObject.value = Object.values(typecalkMap).map((type) => {
      // Сортировка items и groups по уровню
      const sortedItems = type.items.sort((a, b) => a.level - b.level);
      const sortedGroups = type.groups.sort((a, b) => a.level - b.level);

      // Добавление поля count к каждому элементу
      const itemsWithCount = sortedItems.map((item) => ({
        ...item,
        count: count++, // Добавляем поле count и увеличиваем его
      }));

      const groupsWithCount = sortedGroups.map((group) => ({
        ...group,
        count: count++, // Добавляем поле count и увеличиваем его
      }));

      // Создание нового массива AllGroup
      const AllGroup = [...itemsWithCount, ...groupsWithCount];

      // Возвращаем объект с добавленным массивом AllGroup
      return {
        ...type,
        AllGroup: AllGroup,
      };
    });
  }
  const combined = calkObject.value.flatMap((type) => type.AllGroup);

  // titleBlock.value = titleWork;
  summEdit.value = combined.map(() => 0);

  suumItem.value = combined.map(() => 0);
  selectedValues.value = combined.map(() => null);
  checkedValues.value = combined.map(() => true);
  activeNames.value = calkObject.value.map((item) => item._id);
  visibleSteep.value = false;
  isCalculated.value = false;
});

const costWork = () => {
  totalCost.value = 0;
  totalCostPdf.value = 0;
  suumItem.value = [];

  let allFieldsFilled = true;

  // Проходим по каждому объекту в calkObject.value
  calkObject.value.forEach((type) => {
    // Проходим по каждому элементу в AllGroup текущего типа
    type.AllGroup.forEach((item, index) => {
      if (!checkedValues.value[item.count]) {
        suumItem.value[item.count] = 0;
        return;
      }

      const quantity = Number(summEdit.value[item.count]) || 0;

      // Исправленная проверка, учитывающая только типы с required элементом
      if (item.type && (!selectedValues.value[item.count] || quantity === 0)) {
        allFieldsFilled = false;
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
      suumItem.value[item.count] = finalCost;
      totalCostPdf.value = totalCost.value.toFixed(2);
    });
  });

  // Убираем нулевые значения из suumItem
  suumItem.value = suumItem.value.filter((value) => value !== 0);

  // Обновляем статус расчета
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
  console.log(summEdit.value);
  costWork();
};

watch(
  selectedValues,
  (newValues) => {
    isCalculated.value = false;
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
  let allFieldsFilled = true;

  // Проходим по каждому элементу в calkObject.value
  calkObject.value.forEach((type) => {
    // Проходим по каждому элементу в AllGroup текущего типа
    type.AllGroup.forEach((item, index) => {
      if (!checkedValues.value[item.count]) return; // Игнорировать заблокированные элементы

      if (item.type && !summEdit.value[item.count]) {
        allFieldsFilled = false;
      }

      if (
        !item.type &&
        (!selectedValues.value[item.count] || !summEdit.value[item.count])
      ) {
        allFieldsFilled = false;
      }
    });
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
  let totalCost = 0; // Инициализация переменной для итоговой стоимости

  // Сохраняем все используемые индексы для проверки
  const usedIndexes = new Set();

  // Проходим по каждому элементу в calkObject.value
  calkObject.value.forEach((type) => {
    // Проходим по каждому элементу в AllGroup текущего типа
    type.AllGroup.forEach((item) => {
      const countIndex = item.count; // Предполагаем, что `item.count` указывает на правильный индекс
      if (countIndex === undefined) return; // Пропускаем, если `item.count` не определен

      // Проверяем состояние переключателя
      const isChecked = checkedValues.value[countIndex];
      console.log(`Index: ${countIndex}, Checked: ${isChecked}`); // Отладочное сообщение

      // Пропускаем элемент, если переключатель выключен
      if (!isChecked) {
        return;
      }

      const quantity = parseFloat(summEdit.value[countIndex]) || 0;
      console.log(`Quantity for index ${countIndex}: ${quantity}`); // Отладочное сообщение
      const itemCost = (item.cost || 0) * quantity;
      let finalCost = itemCost;
      if (quantity >= (item.unitcoefficient || 0)) {
        const coefficientReduction = 1 - (item.coefficient || 0) / 100;
        finalCost = itemCost * coefficientReduction;
      }

      // Обновляем итоговую стоимость
      //totalCost += finalCost;
      console.log(`Final cost for index ${countIndex}: ${finalCost}`); // Отладочное сообщение

      const selectedLabel = selectedValues.value[countIndex]
        ? elementcalk.value.find(
            (el) => el._id === selectedValues.value[countIndex]
          )?.title || "Не выбрано"
        : "Не выбрано";

      doc.text(`------------------------------------------`, 10, y + 20);
      doc.text(
        `Тип работ ${countIndex + 1}: ${item.name || item.title}`,
        10,
        y
      );

      if (item.type) {
        doc.text(`Количество: ${quantity} ${item.type}`, 10, y + 10);
      } else {
        doc.text(`Выбранный элемент: ${selectedLabel}`, 10, y + 10);
      }

      y += 30;
    });
  });

  // Проверяем, что итоговая стоимость определена и корректна
  doc.text(`Итоговая стоимость: ${totalCostPdf.value} руб.`, 10, y);

  doc.save("calculation.pdf");

  // Выводим итоговую стоимость в консоль для отладки
  console.log(`Total Cost: ${totalCostPdf.value}`);
};

const updateSummEdit = (index, value) => {
  isCalculated.value = false;
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

      <div class="columns is-multiline">
        <div class="column is-12">
          <div class="calk-block-group">
            <el-collapse v-model="activeNames" class="calk-collapse">
              <el-collapse-item
                v-for="(itemCalk, index) in calkObject"
                :key="itemCalk._id"
                :title="itemCalk.name || itemCalk.title"
                :name="itemCalk._id"
              >
                <div v-for="item in itemCalk.AllGroup" :key="item._id">
                  <div>{{ item.name }}</div>
                  <div class="field is-horizontal" v-if="item.type">
                    <div class="field-body field-control">
                      <div class="field">
                        <p class="control">
                          <input
                            class="input"
                            type="number"
                            :value="
                              summEdit[item.count] === 0
                                ? ''
                                : summEdit[item.count]
                            "
                            placeholder="Введите значение"
                            :disabled="!checkedValues[item.count]"
                            @input="
                              updateSummEdit(item.count, $event.target.value)
                            "
                          />
                        </p>
                      </div>
                    </div>
                    <div class="field-label is-normal">
                      <label class="label">{{ item.type }}</label>
                    </div>
                    <div class="field-label has-text-right">
                      <el-switch
                        v-model="checkedValues[item.count]"
                        @change="costWork()"
                        v-if="!item.show_check"
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
                  <div v-else>
                    <div>{{ item.title }}</div>
                    <div class="field is-horizontal">
                      <div class="field-body field-control">
                        <div class="field">
                          <el-select
                            v-model="selectedValues[item.count]"
                            clearable
                            size="large"
                            placeholder="Выберите тип"
                            style="width: 240px"
                            @change="(value) => updateCost(value, item.count)"
                          >
                            <el-option
                              v-for="option in filteredElementOptions(
                                itemCalk.AllGroup[index]
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
                          v-model="checkedValues[item.count]"
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
                  </div>

                  <div class="full-width">
                    {{ item.description }}
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
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
</template>
