package de.fuberlin.wiwiss.silk.linkspec

import de.fuberlin.wiwiss.silk.transformer._

trait Transformer
{
    val params : Map[String, String]

    def evaluate(strings : Seq[String]) : String
}

object Transformer
{
    def apply(transformFunction : String, params : Map[String, String]) : Transformer =
    {
        transformFunction match
        {
            case "replace" => new ReplaceTransformer(params)
            case "regexReplace" => new RegexReplaceTransformer(params)
            case "concat" => new ConcatTransformer(params)
            case "removeBlanks" => new ReplaceTransformer(Map("search" -> " ", "replace" -> ""))
            case "lowerCase" => new LowerCaseTransformer(params)
            case "upperCase" => new UpperCaseTransformer(params)
            case "numReduce" => new RegexReplaceTransformer(Map("regex" -> "[^0-9]+", "replace" -> ""))
            case "stem" => new StemmerTransformer(params)
            case "stripPrefix" => new StripPrefixTransformer(params)
            case "stripPostfix" => new StripPostfixTransformer(params)
            case "stripUriPrefix" => new StripUriPrefixTransformer(params)
            case "alphaReduce" => new RegexReplaceTransformer(Map("regex" -> "[^\\pL]+", "replace" -> ""))
            case "removeSpecialChars" => new RegexReplaceTransformer(Map("regex" -> "[^\\d\\pL\\w]+", "replace" -> ""))
            case _ => throw new IllegalArgumentException("Transform function unknown: " + transformFunction)
        }
        /*
        TODO
        translateWithDictionary(string str[], filename dictionary.csv) 	Translates a string using a dictionary in the form of comma seperated value pairs.
        */
    }
}