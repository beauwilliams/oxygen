import { FilteredSpec } from './types';

export class MarkdownFormatter {
  /**
   * Convert filtered spec to Markdown
   */
  format(filteredSpec: FilteredSpec): string {
    const sections: string[] = [];

    // Meta section
    if (filteredSpec.meta) {
      sections.push(this.formatMeta(filteredSpec.meta));
    }

    // Spec section
    if (filteredSpec.spec) {
      sections.push(this.formatSpec(filteredSpec.spec));
    }

    // Technical detail
    if (filteredSpec.technical_detail) {
      sections.push(this.formatTechnicalDetail(filteredSpec.technical_detail));
    }

    // Product detail
    if (filteredSpec.product_detail) {
      sections.push(this.formatProductDetail(filteredSpec.product_detail));
    }

    // Integration detail
    if (filteredSpec.integration_detail) {
      sections.push(this.formatIntegrationDetail(filteredSpec.integration_detail));
    }

    // Risk (if present in execution view)
    if (filteredSpec.risk) {
      sections.push(this.formatRisk(filteredSpec.risk));
    }

    return sections.join('\n\n');
  }

  private formatMeta(meta: FilteredSpec['meta']): string {
    if (!meta) return '';
    return `# ${meta.id}

**Version:** ${meta.version}  
**Status:** ${meta.status}  
**Created:** ${new Date(meta.created_at).toLocaleString()}
${meta.updated_at ? `**Updated:** ${new Date(meta.updated_at).toLocaleString()}` : ''}`;
  }

  private formatSpec(spec: FilteredSpec['spec']): string {
    if (!spec) return '';
    const sections: string[] = ['## Specification'];

    if (spec.objective) {
      sections.push(`### Objective\n\n${spec.objective}`);
    }

    if (spec.scope) {
      sections.push(`### Scope\n\n${spec.scope}`);
    }

    if (spec.success_criteria && spec.success_criteria.length > 0) {
      sections.push(
        `### Success Criteria\n\n${spec.success_criteria.map((c) => `- ${c}`).join('\n')}`
      );
    }

    if (spec.constraints && spec.constraints.length > 0) {
      sections.push(
        `### Constraints\n\n${spec.constraints.map((c) => `- **${c.type}**: ${c.description}`).join('\n')}`
      );
    }

    if (spec.dependencies && spec.dependencies.length > 0) {
      sections.push(`### Dependencies\n\n${spec.dependencies.map((d) => `- ${d}`).join('\n')}`);
    }

    return sections.join('\n\n');
  }

  private formatTechnicalDetail(technical: FilteredSpec['technical_detail']): string {
    if (!technical) return '';
    const sections: string[] = ['## Technical Details'];

    if (technical.apis && technical.apis.length > 0) {
      sections.push(
        `### APIs\n\n${technical.apis.map((api) => `- **${api.name}**: ${api.description || ''}`).join('\n')}`
      );
    }

    if (technical.data_models && technical.data_models.length > 0) {
      sections.push(
        `### Data Models\n\n${technical.data_models.map((model) => `- **${model.name}**: ${model.fields?.length || 0} fields`).join('\n')}`
      );
    }

    if (technical.architecture_decisions && technical.architecture_decisions.length > 0) {
      sections.push(
        `### Architecture Decisions\n\n${technical.architecture_decisions.map((d) => `- **${d.decision}**: ${d.rationale || ''}`).join('\n')}`
      );
    }

    return sections.join('\n\n');
  }

  private formatProductDetail(product: FilteredSpec['product_detail']): string {
    if (!product) return '';
    const sections: string[] = ['## Product Details'];

    if (product.user_flows && product.user_flows.length > 0) {
      sections.push(
        `### User Flows\n\n${product.user_flows.map((flow) => `- **${flow.name}**: ${flow.description || ''}`).join('\n')}`
      );
    }

    return sections.join('\n\n');
  }

  private formatIntegrationDetail(integration: FilteredSpec['integration_detail']): string {
    if (!integration) return '';
    const sections: string[] = ['## Integration Details'];

    if (integration.contracts && integration.contracts.length > 0) {
      sections.push(
        `### Contracts\n\n${integration.contracts.map((c) => `- **${c.name}** (v${c.version || '1.0'})`).join('\n')}`
      );
    }

    if (integration.webhooks && integration.webhooks.length > 0) {
      sections.push(
        `### Webhooks\n\n${integration.webhooks.map((w) => `- **${w.name}**: ${w.events?.join(', ') || ''}`).join('\n')}`
      );
    }

    return sections.join('\n\n');
  }

  private formatRisk(risk: FilteredSpec['risk']): string {
    if (!risk) return '';
    const sections: string[] = ['## Risk Assessment'];

    if (risk.technical_risks && risk.technical_risks.length > 0) {
      sections.push(
        `### Technical Risks\n\n${risk.technical_risks.map((r) => `- **${r.severity || 'medium'}**: ${r.description}`).join('\n')}`
      );
    }

    if (risk.assumptions && risk.assumptions.length > 0) {
      sections.push(
        `### Assumptions\n\n${risk.assumptions.map((a) => `- ${a.assumption}${a.validated ? ' (validated)' : ''}`).join('\n')}`
      );
    }

    return sections.join('\n\n');
  }
}
