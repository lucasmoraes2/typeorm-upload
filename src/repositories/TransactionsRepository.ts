import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeTypeTransactions = await this.find({
      where: { type: 'income' },
    });

    const totalValueOfIncomeTypeTransactions = incomeTypeTransactions.reduce(
      (totalTransations, transaction) =>
        totalTransations + Number(transaction.value),
      0,
    );

    const outcomeTypeTransactions = await this.find({
      where: { type: 'outcome' },
    });

    const totalValueOfOutcomeTypeTransactions = outcomeTypeTransactions.reduce(
      (totalTransactions, transaction) =>
        totalTransactions + Number(transaction.value),
      0,
    );

    const totalBalance =
      totalValueOfIncomeTypeTransactions - totalValueOfOutcomeTypeTransactions;

    return {
      income: totalValueOfIncomeTypeTransactions,
      outcome: totalValueOfOutcomeTypeTransactions,
      total: totalBalance,
    };
  }
}

export default TransactionsRepository;
