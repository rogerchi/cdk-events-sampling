import { RuleProps, Rule, CfnRule } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

export interface SamplingRuleProps extends RuleProps {
  percentage: number;
}

export class SamplingRule extends Rule {
  constructor(
    scope: Construct,
    id: string,
    { percentage, ...props }: SamplingRuleProps
  ) {
    // Construct the base class with a dummy eventPattern
    super(scope, id, { ...props, eventPattern: { version: [''] } });

    // Escape hatch for getting the CfnRule to be able to use content-based
    //   filtering until this issue is resolved:
    //   https://github.com/aws/aws-cdk/issues/6184
    const cfnRule = this.node.defaultChild as CfnRule;
    const idPattern = this.getIdPatternFromPercentage(percentage);
    if (!props.eventPattern) {
      cfnRule.eventPattern = { id: idPattern };
    } else {
      cfnRule.eventPattern = { ...props.eventPattern, id: idPattern };
    }
  }

  // Convert percentage into list of uuid prefix patterns
  private getIdPatternFromPercentage(percentage: number): { prefix: string }[] {
    if (percentage >= 1 || percentage <= 0) {
      throw new Error('Percentage must be between 0 and 1');
    }
    // Get the first three significant hex digits from the percentage
    const hexString = percentage.toString(16).slice(0, 5).slice(-3);

    // Build up list of prefixes, starting from most significant digit
    let prefixes: string[] = [];
    let a;
    for (a = 0x0; a < parseInt(hexString[0], 16); a++) {
      prefixes.push(a.toString(16));
    }
    let b;
    for (b = 0x0; b < parseInt(hexString[1], 16); b++) {
      prefixes.push(a.toString(16) + b.toString(16));
    }
    let c;
    for (c = 0x0; c < parseInt(hexString[2], 16); c++) {
      prefixes.push(a.toString(16) + b.toString(16) + c.toString(16));
    }

    return prefixes.map((prefix) => ({ prefix }));
  }
}
