package de.fuberlin.wiwiss.silk.linkspec.transformer

import org.scalatest.FlatSpec
import org.scalatest.matchers.{ShouldMatchers}
import de.fuberlin.wiwiss.silk.transformer.UpperCaseTransformer

class UpperCaseTransformerTest extends FlatSpec with ShouldMatchers
{
    val transformer = new UpperCaseTransformer(Map())

    "UpperCaseTransformer" should "return '123'" in
    {
        transformer.evaluate(List("123")) should equal ("123")
    }

    val transformer1 = new UpperCaseTransformer(Map())

    "UpperCaseTransformer" should "return 'ABC'" in
    {
        transformer1.evaluate(List("abc")) should equal ("ABC")
    }
}