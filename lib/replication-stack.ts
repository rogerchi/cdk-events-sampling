import { StackProps, Stack } from 'aws-cdk-lib';
import { CfnRule, EventBus, Rule, RuleProps } from 'aws-cdk-lib/aws-events';
import { EventBus as EventBusTarget } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { SamplingRule } from './constructs/sampling-rule';

export interface ReplicationStackProps extends StackProps {
  sourceEventBus: EventBus;
  targetEventBuses: EventBus[];
  percentage?: number;
}

export class ReplicationStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    {
      sourceEventBus,
      targetEventBuses,
      percentage,
      ...props
    }: ReplicationStackProps
  ) {
    super(scope, id, props);

    const rule = new SamplingRule(this, 'rule', {
      percentage: percentage ?? 0.01,
      eventBus: sourceEventBus,
    });

    for (let bus of targetEventBuses) {
      rule.addTarget(new EventBusTarget(bus));
    }
  }
}
