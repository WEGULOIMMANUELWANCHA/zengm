import classNames from "classnames";
import PropTypes from "prop-types";
import React, { MouseEvent } from "react";
import useClickable from "../../hooks/useClickable";
// eslint-disable-next-line import/no-unresolved
import type { ClassValue } from "classnames/types";

const Row = ({
	row,
}: {
	row: {
		classNames?: ClassValue;
		data: any[];
	};
}) => {
	const { clicked, toggleClicked } = useClickable();
	return (
		<tr
			className={classNames(row.classNames, {
				"table-warning": clicked,
			})}
			onClick={toggleClicked}
		>
			{row.data.map((value = null, i) => {
				// Value is either the value, or an object containing the value as a property
				const actualValue =
					value !== null && value.hasOwnProperty("value") ? value.value : value;

				const props: any = {};

				if (value.classNames) {
					props.className = classNames(value.classNames);
				}

				// Expand clickable area of checkboxes to the whole td
				if (
					actualValue.type === "input" &&
					actualValue.props.type === "checkbox" &&
					actualValue.props.onChange
				) {
					props.onClick = (event: MouseEvent) => {
						if (event.target && (event.target as any).tagName === "TD") {
							actualValue.props.onChange();
						}
					};
					props["data-no-row-highlight"] = "true";
				}

				// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
				return (
					<td key={i} {...props}>
						{actualValue}
					</td>
				);
			})}
		</tr>
	);
};

Row.propTypes = {
	row: PropTypes.shape({
		classNames: PropTypes.object,
		data: PropTypes.array.isRequired,
	}).isRequired,
};

export default Row;
