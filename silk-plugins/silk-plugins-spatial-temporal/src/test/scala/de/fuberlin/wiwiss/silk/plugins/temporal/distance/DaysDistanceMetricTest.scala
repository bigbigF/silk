/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.silkframework.plugins.temporal.distance

import org.scalatest.{FlatSpec, Matchers}



/**
 * Tests the DaysDistance Metric.
 * @author Panayiotis Smeros <psmeros@di.uoa.gr> (National and Kapodistrian University of Athens)
 */


class DaysDistanceMetricTest extends FlatSpec with Matchers {

  val metric = new DaysDistanceMetric()

  //1 Day Distance.
  "DaysDistanceMetric test 1" should "return '1.0'" in {
    metric.evaluate("2000-01-01T00:00:00", "2000-01-02T00:00:00") should equal(1.0)
  }
}
