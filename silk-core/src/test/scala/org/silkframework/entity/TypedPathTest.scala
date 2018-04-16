package org.silkframework.entity

import org.scalatest.FlatSpec
import org.silkframework.util.XmlSerializationHelperTrait

class TypedPathTest extends FlatSpec with XmlSerializationHelperTrait {
  behavior of "TypePath"

  it should "serialize and deserialize correctly" in {
    val typedPath = TypedPath(
      path = Path("http://prop"),
      valueType = CustomValueType("http://someType"),
      isAttribute = true
    )
    testRoundTripSerialization(typedPath)
  }

  it should "serialize and deserialize non uris with slashes correctly" in {
    val typedPath = TypedPath(
      path = Path("fdshsdj//Português"),
      valueType = CustomValueType("http://someType"),
      isAttribute = true
    )
    testRoundTripSerialization(typedPath)
  }
}
