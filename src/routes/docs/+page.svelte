<script lang="ts">
	import 'katex/dist/katex.min.css';
	import Katex from '#lib/components/Katex.svelte';
	import Mermaid from '#lib/components/Mermaid.svelte';
	import SortableSections from '#lib/components/ui/SortableSections.svelte';
	import { m } from '#lib/paraglide/messages.js';

	const diagram = $derived(`
flowchart TD
  Input["Input: blue_team[], red_team[], outcome"]
  Input --> Guard["${m.docs_architecture_diagram_step1()}<br/>assert!(teams not empty)"]
  Guard --> Convert["${m.docs_architecture_diagram_step2()}<br/>PlayerMatchData → WengLinRating"]
  Convert --> Bayesian["${m.docs_architecture_diagram_step3()}<br/>weng_lin_two_teams()"]
  Bayesian --> Post["${m.docs_architecture_diagram_step4()}"]
  Post --> Output["Output: Vec&lt;RatingResult&gt;"]
`);

	const steps = [
		{ title: m.docs_architecture_step1_title(), desc: m.docs_architecture_step1_desc() },
		{ title: m.docs_architecture_step2_title(), desc: m.docs_architecture_step2_desc() },
		{ title: m.docs_architecture_step3_title(), desc: m.docs_architecture_step3_desc() },
		{ title: m.docs_architecture_step4_title(), desc: m.docs_architecture_step4_desc() },
	];

	const postBayesian = [
		{
			katex: '\\text{base\\_delta} = \\mu_{\\text{wenglin}} - \\mu_{\\text{previous}}',
			hint: 'step4a_hint',
		},
		{
			katex: '\\text{perf\\_bonus} = \\text{performance\\_bonus(player, team)}',
			hint: 'step4b_hint',
		},
		{
			katex: '\\text{final\\_delta} = \\text{base\\_delta} + \\text{perf\\_bonus}',
			hint: 'step4c_hint',
		},
		{
			katex:
				'\\text{If winner and final\\_delta} < \\text{floor:}\\ \\text{final\\_delta} = \\text{winner\\_min\\_delta} \\times \\text{engagement\\_scale}',
			hint: 'step4d_hint',
		},
		{
			katex:
				'\\text{new\\_rating} = \\max(\\mu + \\text{final\\_delta}, \\text{rating\\_floor})',
			hint: 'step4e_hint',
		},
		{
			katex:
				'\\sigma_{\\text{new}} = \\sqrt{\\sigma_{\\text{wenglin}}^2 + \\tau^2}',
			hint: 'step4f_hint',
		},
	];

	const keyProperties = [
		m.docs_algorithm_key_properties_0(),
		m.docs_algorithm_key_properties_1(),
		m.docs_algorithm_key_properties_2(),
		m.docs_algorithm_key_properties_3(),
	];

	const hintLabels: Record<string, () => string> = {
		step4a_hint: m.docs_architecture_step4a_hint,
		step4b_hint: m.docs_architecture_step4b_hint,
		step4c_hint: m.docs_architecture_step4c_hint,
		step4d_hint: m.docs_architecture_step4d_hint,
		step4e_hint: m.docs_architecture_step4e_hint,
		step4f_hint: m.docs_architecture_step4f_hint,
	};

	const versions = ['v1', 'v2', 'v3'] as const;

	const latex = {
		c: String.raw`c = \sqrt{2\beta^2 + \sigma^2_{A_{total}} + \sigma^2_{B_{total}}}`,
		pWin: String.raw`P(A\text{ wins}) = \frac{1}{1 + \exp\left(-\frac{\mu_{A_{total}} - \mu_{B_{total}}}{c}\right)}`,
		winMu: String.raw`\mu_{i_{new}} = \mu_i + \frac{\sigma_i^2}{c} \times \Omega`,
		winSigma: String.raw`\sigma_{i_{new}}^2 = \sigma_i^2 \times \left(1 - \frac{\sigma_i^2}{c^2} \times \Delta\right)`,
		loseMu: String.raw`\mu_{j_{new}} = \mu_j - \frac{\sigma_j^2}{c} \times \Omega`,
		loseSigma: String.raw`\sigma_{j_{new}}^2 = \sigma_j^2 \times \left(1 - \frac{\sigma_j^2}{c^2} \times \Delta\right)`,
		omega: String.raw`\Omega = \frac{1}{1 + \exp\left(\frac{\mu_{B_{total}} - \mu_{A_{total}}}{c}\right)}`,
		delta: String.raw`\Delta = \Omega \times (1 - \Omega)`,
	};
</script>

<svelte:head>
	<title>{m.title_docs()}</title>
</svelte:head>

{#snippet algorithm()}
	<p class="mb-3">{m.docs_algorithm_intro()}</p>

	<h4 class="mb-2 text-lg font-bold">{m.docs_algorithm_core_model()}</h4>
	<div class="mb-4">
			<table class="w-full text-sm">
			<thead>
				<tr class="text-left text-xs uppercase tracking-wider text-gold">
					<th class="px-2.5 py-1">{m.docs_algorithm_core_table_parameter()}</th>
					<th class="px-2.5 py-1">{m.docs_algorithm_core_table_symbol()}</th>
					<th class="px-2.5 py-1">{m.docs_algorithm_core_table_meaning()}</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-t border-divider">
					<td class="px-2.5 py-1">{m.docs_algorithm_core_table_rating()}</td>
					<td class="px-2.5 py-1">μ (mu)</td>
					<td class="px-2.5 py-1">{m.docs_algorithm_params_mu()}</td>
				</tr>
				<tr class="border-t border-divider">
					<td class="px-2.5 py-1">{m.docs_algorithm_core_table_uncertainty()}</td>
					<td class="px-2.5 py-1">σ (sigma)</td>
					<td class="px-2.5 py-1">{m.docs_algorithm_params_sigma()}</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h4 class="mb-2 text-lg font-bold">{m.docs_algorithm_equations()}</h4>
	<div class="inset-panel bevel-sunken my-4 rounded-(--radius-skin) p-3">
		<Katex math={latex.c} />
		<Katex math={latex.pWin} />
	</div>

	<p class="mb-1 text-xs">{m.docs_algorithm_winning_team_label()}</p>
	<div class="inset-panel bevel-sunken my-4 rounded-(--radius-skin) p-3">
		<Katex math={latex.winMu} />
		<Katex math={latex.winSigma} />
	</div>

	<p class="mb-1 text-xs">{m.docs_algorithm_losing_team_label()}</p>
	<div class="inset-panel bevel-sunken my-4 rounded-(--radius-skin) p-3">
		<Katex math={latex.loseMu} />
		<Katex math={latex.loseSigma} />
	</div>

	<div class="inset-panel bevel-sunken my-4 rounded-(--radius-skin) p-3">
		<Katex math={latex.omega} />
		<Katex math={latex.delta} />
	</div>
	<p class="mb-1 text-xs">{m.docs_algorithm_surprise_factor_label()}</p>
	<p class="mb-3 text-xs">{m.docs_algorithm_information_gain_label()}</p>

	<h4 class="mb-2 text-lg font-bold">{m.docs_algorithm_key_properties_title()}</h4>
	<ul class="mb-3 space-y-1">
		{#each keyProperties as property (property)}
			<li>• {property}</li>
		{/each}
	</ul>

	<h4 class="mb-2 text-lg font-bold">{m.docs_algorithm_beta_title()}</h4>
	<p>{m.docs_algorithm_beta_desc()}</p>
{/snippet}

{#snippet architecture()}
	<p class="mb-3">{m.docs_architecture_desc()}</p>

	<div class="inset-panel bevel-sunken my-2 rounded-(--radius-skin) p-3">
		<Mermaid code={diagram} />
	</div>

	{#each steps as step, index (step.title)}
		<div class="mb-3 flex flex-wrap gap-3">
			<div
				class="raised-panel bevel-raised flex h-8 w-8 min-w-8 items-center justify-center font-bold text-gold"
			>
				{index + 1}
			</div>
			<div class="flex-1">
				<p class="font-bold">{step.title}</p>
				<p>{step.desc}</p>
			</div>
		</div>
	{/each}
{/snippet}

{#snippet postBayesianSection()}
	<p class="mb-3">{m.docs_post_bayesian_desc()}</p>

	{#each postBayesian as item (item.hint)}
		<div class="mb-4">
			<div class="inset-panel bevel-sunken my-4 rounded-(--radius-skin) p-3">
				<Katex math={item.katex} />
			</div>
			<p class="mt-1 text-xs">
				{hintLabels[item.hint]?.() ?? ''}
			</p>
		</div>
	{/each}
{/snippet}

{#snippet changelog()}
	{#each versions as version (version)}
		{@const latest = version === 'v3'}
		{@const labels = {
			v1: {
				title: m.docs_changelog_v1_title(),
				date: m.docs_changelog_v1_date(),
				desc: m.docs_changelog_v1_desc(),
			},
			v2: {
				title: m.docs_changelog_v2_title(),
				date: m.docs_changelog_v2_date(),
				desc: m.docs_changelog_v2_desc(),
			},
			v3: {
				title: m.docs_changelog_v3_title(),
				date: m.docs_changelog_v3_date(),
				desc: m.docs_changelog_v3_desc(),
			},
		} as const}
		<div class="border-l-4 {latest ? 'border-gold' : 'border-border-dark'}">
			<div class="inset-panel bevel-sunken rounded-(--radius-skin) p-2.5">
				<div class="mb-1 flex items-center justify-between gap-2">
					<span class="font-bold">{labels[version].title}</span>
					<span class="text-xs">{labels[version].date}</span>
				</div>
				<p>{labels[version].desc}</p>
			</div>
		</div>
	{/each}
{/snippet}

<SortableSections
	initialOrder={['algorithm', 'architecture', 'post_bayesian', 'changelog']}
	sections={[
		{ id: 'algorithm', title: m.docs_algorithm_title(), content: algorithm },
		{ id: 'architecture', title: m.docs_architecture_title(), content: architecture },
		{
			id: 'post_bayesian',
			title: m.docs_post_bayesian_title(),
			content: postBayesianSection,
		},
		{ id: 'changelog', title: m.docs_changelog_title(), content: changelog },
	]}
/>
