package de.fuberlin.wiwiss.silk.datasource

import de.fuberlin.wiwiss.silk.linkspec.path.Path
import de.fuberlin.wiwiss.silk.linkspec._

class InstanceSpecification(val variable : String, val restrictions : String, val paths : Traversable[Path])
{
    override def toString = "InstanceSpecification(variable='" + variable + "' restrictions='" + restrictions + "' paths=" + paths + ")"
}

object InstanceSpecification
{
    def retrieve(linkSpec : LinkSpecification) : (InstanceSpecification, InstanceSpecification) =
    {
        val sourceVar = linkSpec.sourceDatasetSpecification.variable
        val targetVar = linkSpec.targetDatasetSpecification.variable

        val sourceRestriction = linkSpec.sourceDatasetSpecification.restriction
        val targetRestriction = linkSpec.targetDatasetSpecification.restriction

        val sourcePaths = collectPaths(sourceVar)(linkSpec.condition)
        val targetPaths = collectPaths(targetVar)(linkSpec.condition)

        ( new InstanceSpecification(sourceVar, sourceRestriction, sourcePaths),
          new InstanceSpecification(targetVar, targetRestriction, targetPaths) )
    }

    private def collectPaths(variable : String)(operator : Operator) : Set[Path] = operator match
    {
        case aggregation : Aggregation => aggregation.operators.flatMap(collectPaths(variable)).toSet
        case comparison : Comparison => comparison.inputs.flatMap(collectPathsFromInput(variable)).toSet
    }

    private def collectPathsFromInput(variable : String)(param : Input) : Set[Path] = param match
    {
        case p : PathInput if p.path.variable == variable => Set(p.path)
        case p : TransformInput => p.inputs.flatMap(collectPathsFromInput(variable)).toSet
        case _ => Set()
    }
}
