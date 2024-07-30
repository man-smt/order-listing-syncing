import { CommissionRule } from '../commissionRules/baseRule'
import weekendRule from '../commissionRules/weekendRule'
import nightOrderRule from '../commissionRules/nightOrderRule'
import { IOrder } from '../models/order'

const rules: CommissionRule[] = [weekendRule, nightOrderRule]

export const calculateCommission = (order: IOrder): number => {
  const applicableRules = rules.filter((rule) => rule.matches(order))

  if (applicableRules.length === 0) {
    return 0
  }

  const highestPriorityRule = applicableRules.reduce((prev, current) => {
    return prev.priority < current.priority ? prev : current
  })

  return highestPriorityRule.calculate(order)
}
