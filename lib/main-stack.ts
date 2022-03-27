import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { CloudWatchLogGroup } from 'aws-cdk-lib/aws-events-targets';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface MainEventBusStackProps extends StackProps {
  envName: string;
}

export class MainEventBusStack extends Stack {
  public readonly eventBus: EventBus;
  constructor(
    scope: Construct,
    id: string,
    { envName, ...props }: MainEventBusStackProps
  ) {
    super(scope, id, props);

    this.eventBus = new EventBus(this, 'eventBus');

    const logGroup = new LogGroup(this, 'eventsLog', {
      logGroupName: `/aws/events/cont-test-eventBus-${envName}`,
    });
    const rule = new Rule(this, 'catchAll', {
      eventBus: this.eventBus,
      eventPattern: {
        version: ['0'],
      },
    });
    rule.addTarget(new CloudWatchLogGroup(logGroup));

    new CfnOutput(this, 'eventBusName', {
      value: this.eventBus.eventBusName,
    });
  }
}
