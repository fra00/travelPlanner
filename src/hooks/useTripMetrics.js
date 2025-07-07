import { useMemo } from "react";
import { ROUTE_TYPES } from "../utils/constants";

const calculateStandardDeviation = (data) => {
  if (data.length < 2) return 0;
  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  const variance =
    data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  return Math.sqrt(variance);
};

/**
 * Un custom hook per calcolare le metriche derivate dallo stato del viaggio.
 * @param {object} state - Lo stato globale del viaggio dal TripContext.
 * @returns {object} Un oggetto contenente i dati calcolati.
 */
export const useTripMetrics = (state) => {
  const { days, fuel, participants, generalExpenses } = state;

  // Ottimizzazione: Memoizza una mappa dei partecipanti per ID per ricerche veloci.
  // Questo evita di ricalcolare le spese se cambia solo un riferimento all'array
  // dei partecipanti ma non i loro ID o nomi.
  const participantMap = useMemo(() => {
    return participants.reduce((map, p) => {
      map.set(p.id, p.name || p.email || 'Sconosciuto');
      return map;
    }, new Map());
  }, [participants]);

  // Deriva il numero di persone e giorni dalla lunghezza degli array relativi.
  const numPeople = participants.length || 1; // Evita divisione per zero
  const numDays = days.length || 1; // Evita divisione per zero

  // Calcola la distanza totale sommando le distanze di ogni giorno.
  // useMemo assicura che il calcolo venga rieseguito solo se l'array 'days' cambia.
  const totalDistance = useMemo(() => {
    return days.reduce((total, day) => total + (day.distance || 0), 0);
  }, [days]);

  // Calcola il costo stimato del carburante.
  const estimatedFuelCost = useMemo(() => {
    if (!fuel.kmPerLiter || fuel.kmPerLiter === 0) return 0;
    return (totalDistance / fuel.kmPerLiter) * fuel.costPerLiter;
  }, [totalDistance, fuel]);

  const estimatedFuelCostPerPerson = useMemo(() => {
    if (!numPeople || numPeople === 0) return 0;
    return estimatedFuelCost / numPeople;
  }, [estimatedFuelCost, numPeople]);

  // Calcola il costo totale e una lista unificata di tutte le spese
  const { allExpenses, totalCost } = useMemo(() => {
    let currentTotalCost = 0;
    const allExpensesList = [];

    // Aggiungi il costo del carburante alla lista e al totale se è maggiore di zero
    if (estimatedFuelCost > 0) {
      currentTotalCost += estimatedFuelCost;
      allExpensesList.push({
        id: "fuel_cost",
        dayIndex: "Generale",
        description: "Costo Carburante Stimato",
        amount: estimatedFuelCost,
        perPerson: false,
        paidById: null,
        paidByName: "N/A", // Il carburante non ha un pagante specifico
        calculatedAmount: estimatedFuelCost,
      });
    }

    // Processa le spese generali
    generalExpenses.forEach((expense) => {
      const calculatedAmount = expense.perPerson
        ? expense.amount * numPeople
        : expense.amount;
      currentTotalCost += calculatedAmount;
      const paidBy = participantMap.get(expense.paidById) || 'N/A';
      allExpensesList.push({
        ...expense,
        dayIndex: "Generale",
        paidByName: paidBy,
        calculatedAmount,
      });
    });

    // Processa le spese giornaliere
    days.forEach((day, index) => {
      day.expenses.forEach((expense) => {
        const calculatedAmount = expense.perPerson
          ? expense.amount * numPeople
          : expense.amount;
        currentTotalCost += calculatedAmount;
        const paidBy = participantMap.get(expense.paidById) || 'N/A';
        allExpensesList.push({
          ...expense,
          dayIndex: `Giorno ${index + 1}`,
          paidByName: paidBy,
          calculatedAmount,
        });
      });
    });

    return { allExpenses: allExpensesList, totalCost: currentTotalCost };
  }, [generalExpenses, days, numPeople, estimatedFuelCost, participantMap]);

  // Calcoli per le statistiche testuali
  const costPerPerson = useMemo(
    () => (numPeople > 0 ? totalCost / numPeople : 0),
    [totalCost, numPeople]
  );
  const costPerDay = useMemo(
    () => (numDays > 0 ? totalCost / numDays : 0),
    [totalCost, numDays]
  );
  const avgDistancePerDay = useMemo(
    () => (numDays > 0 ? totalDistance / numDays : 0),
    [totalDistance, numDays]
  );
  const totalDrivingTime = useMemo(
    () =>
      days.reduce((total, day) => {
        const speed = ROUTE_TYPES[day.routeType] || 80;
        if (speed > 0) {
          return total + (day.distance || 0) / speed;
        }
        return total;
      }, 0),
    [days]
  );

  // Calcoli per gli indicatori di qualità della pianificazione
  const planningMetrics = useMemo(() => {
    const dailyCosts = days.map((day) =>
      day.expenses.reduce(
        (acc, exp) =>
          acc + (exp.perPerson ? exp.amount * numPeople : exp.amount),
        0
      )
    );

    const costStdDev = calculateStandardDeviation(dailyCosts);
    let costConsistency = "N/D";
    if (costPerDay > 0) {
      const costCV = (costStdDev / costPerDay) * 100; // Coefficient of Variation
      if (costCV < 30) costConsistency = "Molto Buono";
      else if (costCV < 60) costConsistency = "Buono";
      else costConsistency = "Da Rivedere";
    }

    const dailyDrivingTimes = days.map((day) => {
      const speed = ROUTE_TYPES[day.routeType] || 80;
      return (day.distance || 0) / (speed > 0 ? speed : 1);
    });
    const avgDrivingTimePerDay = numDays > 0 ? totalDrivingTime / numDays : 0;
    const drivingTimeStdDev = calculateStandardDeviation(dailyDrivingTimes);
    const maxDrivingTime = Math.max(0, ...dailyDrivingTimes);

    let pacing = "N/D";
    if (totalDrivingTime > 0) {
      const cv =
        avgDrivingTimePerDay > 0
          ? (drivingTimeStdDev / avgDrivingTimePerDay) * 100
          : 0;

      let balanceScore;
      if (cv < 35) balanceScore = 2;
      else if (cv < 70) balanceScore = 1;
      else balanceScore = 0;
      let maxHoursScore;
      if (maxDrivingTime <= 6) maxHoursScore = 2;
      else if (maxDrivingTime <= 8) maxHoursScore = 1;
      else maxHoursScore = 0;
      const finalScore = Math.min(balanceScore, maxHoursScore);
      if (finalScore === 2) pacing = "Molto Buono";
      else if (finalScore === 1) pacing = "Buono";
      else pacing = "Da Rivedere";
    }

    const dailyActivitiesCount = days.map((day) => day.activities.length);
    const totalActivities = dailyActivitiesCount.reduce(
      (acc, val) => acc + val,
      0
    );
    const avgActivitiesPerDay = numDays > 0 ? totalActivities / numDays : 0;

    let scheduleIntensity = "N/D";
    if (totalActivities > 0) {
      if (avgActivitiesPerDay <= 2.5) {
        scheduleIntensity = "Rilassato";
      } else if (avgActivitiesPerDay <= 4.5) {
        scheduleIntensity = "Moderato";
      } else {
        scheduleIntensity = "Intenso";
      }
    }

    return { costConsistency, pacing, scheduleIntensity };
  }, [days, numPeople, costPerDay, totalDrivingTime, numDays]);

  // Preparazione dati per i grafici
  const expenseDistributionData = useMemo(() => {
    const generalExpensesTotal = generalExpenses.reduce(
      (acc, exp) => acc + (exp.perPerson ? exp.amount * numPeople : exp.amount),
      0
    );
    const dailyExpensesTotal = days
      .flatMap((day) => day.expenses)
      .reduce(
        (acc, exp) =>
          acc + (exp.perPerson ? exp.amount * numPeople : exp.amount),
        0
      );

    return {
      labels: ["Carburante", "Spese Generali", "Spese Giornaliere"],
      datasets: [
        {
          data: [estimatedFuelCost, generalExpensesTotal, dailyExpensesTotal],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    };
  }, [estimatedFuelCost, generalExpenses, days, numPeople]);

  const dailyCostData = useMemo(() => {
    const labels = days.map((_, index) => `Giorno ${index + 1}`);
    const data = days.map((day) =>
      day.expenses.reduce(
        (acc, exp) =>
          acc + (exp.perPerson ? exp.amount * numPeople : exp.amount),
        0
      )
    );
    return {
      labels,
      datasets: [
        {
          label: "Costo Giornaliero (€)",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  }, [days, numPeople]);

  const dailyDistanceData = useMemo(() => {
    const labels = days.map((_, index) => `Giorno ${index + 1}`);
    const data = days.map((day) => day.distance);
    return {
      labels,
      datasets: [
        {
          label: "Distanza Giornaliera (km)",
          data,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          fill: true,
        },
      ],
    };
  }, [days]);

  const dailyBalanceData = useMemo(() => {
    const labels = days.map((_, index) => `Giorno ${index + 1}`);
    const drivingHours = days.map((day) => {
      const speed = ROUTE_TYPES[day.routeType] || 80;
      return (day.distance || 0) / (speed > 0 ? speed : 1);
    });
    const activityCounts = days.map((day) => day.activities.length);

    return {
      labels,
      datasets: [
        {
          type: "bar",
          label: "Ore di Guida",
          data: drivingHours,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          yAxisID: "y_hours",
        },
        {
          type: "line",
          label: "Numero Attività",
          data: activityCounts,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "y_activities",
          fill: false,
          tension: 0.1,
        },
      ],
    };
  }, [days]);

  // Calcola il bilancio tra i partecipanti
  const balanceTransactions = useMemo(() => {
    if (participantMap.size < 2) {
      return [];
    }

    const balances = {};
    participantMap.forEach((name, id) => {
      balances[id] = { name, balance: 0 };
    });

    // Considera solo le spese effettive con un pagante per il bilancio
    const expensesToShare = allExpenses.filter(
      (exp) => exp.id !== "fuel_cost" && exp.paidById
    );

    let totalSharedExpenses = 0;
    expensesToShare.forEach((expense) => {
      totalSharedExpenses += expense.calculatedAmount;
      if (balances[expense.paidById]) {
        balances[expense.paidById].balance += expense.calculatedAmount;
      }
    });

    if (totalSharedExpenses === 0) return [];

    const sharePerPerson = totalSharedExpenses / numPeople;

    participants.forEach((p) => {
      balances[p.id].balance -= sharePerPerson;
    });

    const debtors = Object.values(balances)
      .filter((p) => p.balance < 0)
      .sort((a, b) => a.balance - b.balance);
    const creditors = Object.values(balances)
      .filter((p) => p.balance > 0)
      .sort((a, b) => b.balance - a.balance);

    const transactions = [];
    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(-debtor.balance, creditor.balance);

      transactions.push({ from: debtor.name, to: creditor.name, amount });

      debtor.balance += amount;
      creditor.balance -= amount;

      if (Math.abs(debtor.balance) < 0.01) i++;
      if (Math.abs(creditor.balance) < 0.01) j++;
    }
    return transactions;
  }, [allExpenses, participantMap, numPeople]);

  const participantExpenseData = useMemo(() => {
    const spendingByParticipant = {};

    participantMap.forEach((name) => {
      spendingByParticipant[name] = 0;
    });

    allExpenses.forEach((expense) => {
      if (expense.paidByName && expense.paidByName !== 'N/A') {
        spendingByParticipant[expense.paidByName] += expense.calculatedAmount;
      }
    });

    const labels = Object.keys(spendingByParticipant);
    const data = Object.values(spendingByParticipant);

    const backgroundColors = [
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: labels.map(
            (_, i) => backgroundColors[i % backgroundColors.length]
          ),
        },
      ],
    };
  }, [allExpenses, participantMap]);

  return {
    totalDistance,
    estimatedFuelCost,
    estimatedFuelCostPerPerson,
    allExpenses,
    totalCost,
    costPerPerson,
    costPerDay,
    avgDistancePerDay,
    totalDrivingTime,
    planningMetrics,
    // Dati pronti per i grafici
    expenseDistributionData,
    dailyCostData,
    dailyDistanceData,
    dailyBalanceData,
    balanceTransactions,
    participantExpenseData,
  };
};
